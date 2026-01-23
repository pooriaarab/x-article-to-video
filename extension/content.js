// Content script to extract X post data from Twitter/X pages

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'captureTweet') {
    const xPostData = extractXPostData();
    sendResponse({ success: true, data: xPostData });
  }
  return true; // Keep message channel open for async response
});

// Detect if the current page is an X article/long-form post
function detectArticlePage() {
  // Check for article-specific elements in the page
  const hasArticleContainer = document.querySelector('[data-testid="articleContainer"]') !== null;
  const hasNoteContainer = document.querySelector('[data-testid="noteContainer"]') !== null;

  // Check for article-specific text elements
  const hasArticleText = document.querySelector('[data-testid="articleText"]') !== null;
  const hasNoteText = document.querySelector('[data-testid="noteText"]') !== null;

  // Check URL pattern - X articles often have indicators in the URL or page title
  const url = window.location.href;
  const isLongFormUrl = url.includes('/articles/') || url.includes('/notes/');

  // Check page title - X articles often have "Article" in meta or title
  const pageTitle = document.title.toLowerCase();
  const hasArticleInTitle = pageTitle.includes('article') || pageTitle.includes('note');

  // Look for rich text editor indicators or article-specific class names
  const hasRichTextContent = document.querySelector('[class*="article"], [class*="richtext"], [class*="longform"]') !== null;

  return hasArticleContainer || hasNoteContainer || hasArticleText || hasNoteText ||
         isLongFormUrl || (hasArticleInTitle && hasRichTextContent);
}

function extractXPostData() {
  // Detect if we're on an X article/long-form post page
  const isArticlePage = detectArticlePage();

  let xPostArticles = null;

  if (isArticlePage) {
    // For article pages, prioritize article-specific selectors
    // Try to find the main article container first
    xPostArticles = document.querySelectorAll('[data-testid="articleContainer"], [data-testid="noteContainer"]');

    // Fallback: Look for article elements with rich-text content
    if (xPostArticles.length === 0) {
      const articles = document.querySelectorAll('article');
      // Filter for articles that contain substantial text content (likely the main article)
      const contentArticles = Array.from(articles).filter(article => {
        const textContent = article.innerText || article.textContent;
        return textContent && textContent.length > 200; // Articles typically have substantial text
      });
      if (contentArticles.length > 0) {
        xPostArticles = contentArticles;
      }
    }
  } else {
    // For regular tweet pages, use standard tweet selectors
    xPostArticles = document.querySelectorAll('article[data-testid="tweet"]');
  }

  // Universal fallback: Try generic article elements
  if (!xPostArticles || xPostArticles.length === 0) {
    const allArticles = document.querySelectorAll('article');
    // Filter out likely non-content articles (navigation, ads, etc.)
    const contentArticles = Array.from(allArticles).filter(article => {
      const textContent = article.innerText || article.textContent;
      // Must have some substantial text content
      return textContent && textContent.length > 50;
    });
    if (contentArticles.length > 0) {
      xPostArticles = contentArticles;
    }
  }

  if (!xPostArticles || xPostArticles.length === 0) {
    return { error: 'No X posts found on this page' };
  }

  try {
    const allPosts = [];

    xPostArticles.forEach((xPostArticle, index) => {
      try {
        // Extract X post text - prioritize selectors based on page type
        let xPostTextElement = null;

        if (isArticlePage) {
          // For article pages, try article-specific selectors first
          xPostTextElement = xPostArticle.querySelector('[data-testid="noteText"], [data-testid="articleText"]');

          // Try to find rich text content containers
          if (!xPostTextElement) {
            xPostTextElement = xPostArticle.querySelector('[class*="richtext"], [class*="article-content"], [class*="longform"]');
          }
        }

        // Standard tweet text selector
        if (!xPostTextElement) {
          xPostTextElement = xPostArticle.querySelector('[data-testid="tweetText"]');
        }

        // Enhanced fallback - try to find any substantial text content
        if (!xPostTextElement) {
          // Look for elements with lang attribute (primary content indicators)
          const textElements = xPostArticle.querySelectorAll('div[lang], p[lang], span[lang]');
          if (textElements.length > 0) {
            // Find the element with the most text
            let longestText = '';
            textElements.forEach(el => {
              const text = el.innerText || el.textContent;
              if (text && text.length > longestText.length) {
                longestText = text;
                xPostTextElement = el;
              }
            });
          }

          // Last resort: find any container with substantial text
          if (!xPostTextElement) {
            const allDivs = xPostArticle.querySelectorAll('div');
            for (const div of allDivs) {
              const text = div.innerText || div.textContent;
              if (text && text.length > 100) {
                xPostTextElement = div;
                break;
              }
            }
          }
        }

        const xPostText = xPostTextElement ? xPostTextElement.innerText : '';

        // Skip if no text (might be a retweet placeholder or ad)
        if (!xPostText || xPostText.length < 3) return;

        // Extract author info - try multiple selectors
        let authorNameElement = xPostArticle.querySelector('[data-testid="User-Name"] span');
        if (!authorNameElement) {
          // Fallback: look for author-related spans
          authorNameElement = xPostArticle.querySelector('a[href*="/"] span');
        }
        const authorName = authorNameElement ? authorNameElement.innerText.trim() : 'Unknown';

        // Extract username
        const usernameElements = xPostArticle.querySelectorAll('[data-testid="User-Name"] a, a[href^="/"]');
        let username = '@unknown';
        for (const el of usernameElements) {
          const text = el.innerText.trim();
          const href = el.getAttribute('href');

          // Check if text starts with @ or extract from href
          if (text.startsWith('@')) {
            username = text;
            break;
          } else if (href && href.startsWith('/') && !href.includes('/status/')) {
            username = '@' + href.substring(1).split('/')[0];
            if (username.length > 2) break;
          }
        }

        // Extract profile picture - try multiple selectors
        let profilePicElement = xPostArticle.querySelector('img[alt][src*="profile"]');
        if (!profilePicElement) {
          // Fallback: find any avatar/profile image
          profilePicElement = xPostArticle.querySelector('img[src*="pbs.twimg.com/profile"]');
        }
        const profilePicUrl = profilePicElement ? profilePicElement.src : '';

        // Extract media (images/videos)
        const media = [];

        // Images
        const imageElements = xPostArticle.querySelectorAll('[data-testid="tweetPhoto"] img');
        imageElements.forEach(img => {
          if (img.src && !img.src.includes('profile')) {
            media.push({
              type: 'image',
              url: img.src
            });
          }
        });

        // Videos
        const videoElements = xPostArticle.querySelectorAll('video');
        videoElements.forEach(video => {
          if (video.poster) {
            media.push({
              type: 'video',
              url: video.src || video.poster,
              poster: video.poster
            });
          }
        });

        // Get X post timestamp
        const timeElement = xPostArticle.querySelector('time');
        const timestamp = timeElement ? timeElement.getAttribute('datetime') : new Date().toISOString();

        allPosts.push({
          id: `post-${index}`,
          text: xPostText,
          author: {
            name: authorName,
            username: username,
            profilePicUrl: profilePicUrl
          },
          media: media,
          timestamp: timestamp,
          url: window.location.href
        });
      } catch (error) {
        // Skip this post if extraction fails
        console.warn('Failed to extract post:', error);
      }
    });

    // Return all posts if multiple, or single post data if only one
    if (allPosts.length === 0) {
      return { error: 'No valid X posts found on this page' };
    } else if (allPosts.length === 1) {
      // Return single post format for backward compatibility
      return allPosts[0];
    } else {
      // Return multiple posts
      return { multiplePosts: true, posts: allPosts };
    }
  } catch (error) {
    return {
      error: `Failed to extract X posts: ${error.message}`
    };
  }
}

// Add visual indicator when hovering over X posts
document.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.textContent = `
    .tweet-to-video-highlight {
      outline: 2px solid #0084ff !important;
      outline-offset: 2px;
      transition: outline 0.2s ease;
    }
  `;
  document.head.appendChild(style);
});
