// Videos page logic
let currentFilter = 'all';
let allVideos = [];

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  loadVideos();
  setupEventListeners();

  // Listen for storage changes to update in real-time
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.videoHistory) {
      loadVideos();
    }
  });
});

function setupEventListeners() {
  // Back button
  document.getElementById('backButton').addEventListener('click', () => {
    window.location.href = 'popup.html';
  });

  // Clear all button
  document.getElementById('clearAllButton').addEventListener('click', () => {
    if (confirm('Are you sure you want to delete all videos?')) {
      chrome.storage.local.set({ videoHistory: [] }, () => {
        allVideos = [];
        renderVideos();
      });
    }
  });

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentFilter = e.target.dataset.filter;
      renderVideos();
    });
  });
}

function loadVideos() {
  chrome.storage.local.get(['videoHistory'], (result) => {
    allVideos = result.videoHistory || [];
    // Sort by timestamp (newest first)
    allVideos.sort((a, b) => b.timestamp - a.timestamp);
    renderVideos();
  });
}

function renderVideos() {
  const grid = document.getElementById('videosGrid');
  const emptyState = document.getElementById('emptyState');

  // Filter videos
  let filteredVideos = allVideos;
  if (currentFilter !== 'all') {
    filteredVideos = allVideos.filter(v => v.status === currentFilter);
  }

  if (filteredVideos.length === 0) {
    grid.style.display = 'none';
    emptyState.style.display = 'flex';
    return;
  }

  grid.style.display = 'grid';
  emptyState.style.display = 'none';

  grid.innerHTML = filteredVideos.map(video => createVideoCard(video)).join('');

  // Add event listeners to cards
  filteredVideos.forEach((video, index) => {
    const card = grid.children[index];

    // Download button
    const downloadBtn = card.querySelector('.download-btn');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        downloadVideo(video);
      });
    }

    // Delete button
    const deleteBtn = card.querySelector('.delete-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteVideo(video.id);
      });
    }

    // Retry button
    const retryBtn = card.querySelector('.retry-btn');
    if (retryBtn) {
      retryBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        retryVideo(video);
      });
    }

    // Card click - play video if completed
    if (video.status === 'completed') {
      card.addEventListener('click', () => {
        playVideo(video);
      });
    }
  });
}

function createVideoCard(video) {
  // Validate video data
  if (!video || !video.id) {
    console.error('Invalid video data:', video);
    return '';
  }

  const statusClass = `status-${video.status || 'processing'}`;
  const statusText = (video.status || 'processing').charAt(0).toUpperCase() + (video.status || 'processing').slice(1);

  const timeAgo = getTimeAgo(video.timestamp || Date.now());
  const durationText = video.duration ? `${video.duration}s` : 'N/A';

  // Truncate text if too long
  const displayText = video.text && video.text.length > 100
    ? video.text.substring(0, 100) + '...'
    : (video.text || 'No text available');

  let thumbnailContent = '';
  if (video.status === 'completed' && video.videoUrl) {
    thumbnailContent = `
      <video>
        <source src="${video.videoUrl}" type="video/mp4">
      </video>
    `;
  } else if (video.status === 'processing') {
    thumbnailContent = `
      <div class="processing-overlay">
        <div class="spinner"></div>
        <div class="processing-text">Generating...</div>
      </div>
    `;
  } else if (video.status === 'failed') {
    thumbnailContent = `
      <div class="processing-overlay">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="m15 9-6 6"/>
          <path d="m9 9 6 6"/>
        </svg>
        <div style="margin-top: 12px; font-size: 14px; font-weight: 600; color: #EF4444;">Failed</div>
      </div>
    `;
  }

  let actionButtons = '';
  if (video.status === 'completed') {
    actionButtons = `
      <button class="action-btn primary download-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" x2="12" y1="15" y2="3"/>
        </svg>
        Download
      </button>
      <button class="action-btn danger delete-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 6h18"/>
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
        </svg>
        Delete
      </button>
    `;
  } else if (video.status === 'failed') {
    actionButtons = `
      <button class="action-btn primary retry-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/>
          <path d="M21 3v5h-5"/>
        </svg>
        Retry
      </button>
      <button class="action-btn danger delete-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 6h18"/>
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
        </svg>
        Delete
      </button>
    `;
  } else {
    actionButtons = `
      <button class="action-btn danger delete-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 6h18"/>
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
        </svg>
        Delete
      </button>
    `;
  }

  return `
    <div class="video-card" data-video-id="${video.id}">
      <div class="video-thumbnail">
        ${thumbnailContent}
        <div class="status-badge ${statusClass}">${statusText}</div>
      </div>
      <div class="video-info">
        <div class="video-style">${video.styleName || video.style || 'Unknown Style'}</div>
        <div class="video-text">${displayText}</div>
        <div class="video-meta">
          <div class="video-duration">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            ${durationText}
          </div>
          <div class="video-timestamp">${timeAgo}</div>
        </div>
      </div>
      <div class="video-actions">
        ${actionButtons}
      </div>
    </div>
  `;
}

function downloadVideo(video) {
  if (!video.videoUrl) {
    console.error('No video URL available for download');
    alert('Video URL not available. The video may have expired or was not generated properly.');
    return;
  }

  try {
    const a = document.createElement('a');
    a.href = video.videoUrl;
    a.download = `${video.style || 'video'}-${video.timestamp || Date.now()}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (error) {
    console.error('Download failed:', error);
    alert('Failed to download video. Please try again or regenerate the video.');
  }
}

function deleteVideo(videoId) {
  const video = allVideos.find(v => v.id === videoId);
  const videoName = video ? (video.styleName || video.style || 'this video') : 'this video';

  if (!confirm(`Delete ${videoName}? This action cannot be undone.`)) return;

  allVideos = allVideos.filter(v => v.id !== videoId);
  chrome.storage.local.set({ videoHistory: allVideos }, () => {
    renderVideos();
  });
}

function retryVideo(video) {
  // Validate video data before retry
  if (!video || !video.text || !video.style) {
    console.error('Cannot retry: Invalid video data', video);
    alert('Cannot retry this video due to missing data. Please try generating a new video.');
    return;
  }

  // Navigate back to popup and trigger regeneration
  chrome.storage.local.set({
    retryVideo: {
      text: video.text,
      author: video.author || { name: 'Unknown', username: '@unknown', profilePicUrl: '' },
      style: video.style
    }
  }, () => {
    window.location.href = 'popup.html';
  });
}

function playVideo(video) {
  if (!video.videoUrl) {
    console.error('No video URL available for playback');
    alert('Video not available for playback. The video may not be ready yet.');
    return;
  }

  try {
    // Open video in new tab
    chrome.tabs.create({ url: video.videoUrl });
  } catch (error) {
    console.error('Failed to play video:', error);
    alert('Failed to open video. Please try downloading it instead.');
  }
}

function getTimeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
