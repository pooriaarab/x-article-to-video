import { Composition } from "remotion";
import { TweetMinimal } from "./TweetMinimal";
import { TweetTerminal } from "./TweetTerminal";
import { TweetKinetic } from "./TweetKinetic";
import { TweetGlassmorph } from "./TweetGlassmorph";
import { TweetNeon } from "./TweetNeon";
import { TweetExplosive } from "./TweetExplosive";
import { TweetTypewriter } from "./TweetTypewriter";
import { TweetTikTok } from "./TweetTikTok";
import { TweetMrBeast } from "./TweetMrBeast";
import { TweetNeoBrutalism } from "./TweetNeoBrutalism";
import { TweetDarkCyber } from "./TweetDarkCyber";
import { TweetAppleSaaS } from "./TweetAppleSaaS";
import { TweetZoomCut } from "./TweetZoomCut";
import { Tweet3DPerspective } from "./Tweet3DPerspective";
import { TweetGlitchVHS } from "./TweetGlitchVHS";
import { TweetParticleBurst } from "./TweetParticleBurst";
import { TweetStarWars } from "./TweetStarWars";
import { TweetSpeedRead } from "./TweetSpeedRead";
import { TweetSubwaySurfers } from "./TweetSubwaySurfers";
import { TweetMinecraftParkour } from "./TweetMinecraftParkour";
import { TweetLofi } from "./TweetLofi";
import { TweetComicBook } from "./TweetComicBook";
import { TweetMatrix } from "./TweetMatrix";
import { TweetDisney } from "./TweetDisney";
import { TweetAnime } from "./TweetAnime";
import { TweetPokemon } from "./TweetPokemon";
import { TweetFortnite } from "./TweetFortnite";
import { TweetTechnicalExplainer } from "./TweetTechnicalExplainer";

export const RemotionRoot: React.FC = () => {
  // Default tweet data for preview
  const defaultTweetData = {
    text: "This is an amazing Chrome extension! Turn any tweet into a beautiful video in seconds. 🚀",
    author: {
      name: "John Doe",
      username: "@johndoe",
      profilePicUrl: "https://via.placeholder.com/100"
    },
    media: []
  };

  // Default duration in frames (5 seconds at 30fps = 150 frames)
  const defaultDurationInFrames = 150;

  return (
    <>
      <Composition
        id="TweetMinimal"
        component={TweetMinimal}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          tweetData: defaultTweetData,
          durationInFrames: defaultDurationInFrames
        }}
        calculateMetadata={({ props }) => {
          return {
            durationInFrames: props.durationInFrames || defaultDurationInFrames,
            fps: 30,
            width: 1080,
            height: 1080,
          };
        }}
      />
      <Composition
        id="TweetTerminal"
        component={TweetTerminal}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          tweetData: defaultTweetData,
          durationInFrames: defaultDurationInFrames
        }}
        calculateMetadata={({ props }) => {
          return {
            durationInFrames: props.durationInFrames || defaultDurationInFrames,
            fps: 30,
            width: 1080,
            height: 1080,
          };
        }}
      />
      <Composition
        id="TweetKinetic"
        component={TweetKinetic}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          tweetData: defaultTweetData,
          durationInFrames: defaultDurationInFrames
        }}
        calculateMetadata={({ props }) => {
          return {
            durationInFrames: props.durationInFrames || defaultDurationInFrames,
            fps: 30,
            width: 1080,
            height: 1080,
          };
        }}
      />
      <Composition
        id="TweetGlassmorphism"
        component={TweetGlassmorph}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          tweetData: defaultTweetData,
          durationInFrames: defaultDurationInFrames
        }}
        calculateMetadata={({ props }) => {
          return {
            durationInFrames: props.durationInFrames || defaultDurationInFrames,
            fps: 30,
            width: 1080,
            height: 1080,
          };
        }}
      />
      <Composition
        id="TweetNeon"
        component={TweetNeon}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          tweetData: defaultTweetData,
          durationInFrames: defaultDurationInFrames
        }}
        calculateMetadata={({ props }) => {
          return {
            durationInFrames: props.durationInFrames || defaultDurationInFrames,
            fps: 30,
            width: 1080,
            height: 1080,
          };
        }}
      />
      <Composition
        id="TweetExplosive"
        component={TweetExplosive}
        
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          tweetData: defaultTweetData,
          durationInFrames: defaultDurationInFrames
        }}
        calculateMetadata={({ props }) => {
          return {
            durationInFrames: props.durationInFrames || defaultDurationInFrames,
            fps: 30,
            width: 1080,
            height: 1080,
          };
        }}
      />
      <Composition
        id="TweetTypewriter"
        component={TweetTypewriter}
        
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          tweetData: defaultTweetData,
          durationInFrames: defaultDurationInFrames
        }}
        calculateMetadata={({ props }) => {
          return {
            durationInFrames: props.durationInFrames || defaultDurationInFrames,
            fps: 30,
            width: 1080,
            height: 1080,
          };
        }}
      />
      <Composition
        id="TweetTikTok"
        component={TweetTikTok}
        
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          tweetData: defaultTweetData,
          durationInFrames: defaultDurationInFrames
        }}
        calculateMetadata={({ props }) => {
          return {
            durationInFrames: props.durationInFrames || defaultDurationInFrames,
            fps: 30,
            width: 1080,
            height: 1080,
          };
        }}
      />
      <Composition
        id="TweetMrBeast"
        component={TweetMrBeast}
        
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          tweetData: defaultTweetData,
          durationInFrames: defaultDurationInFrames
        }}
        calculateMetadata={({ props }) => {
          return {
            durationInFrames: props.durationInFrames || defaultDurationInFrames,
            fps: 30,
            width: 1080,
            height: 1080,
          };
        }}
      />
      <Composition
        id="TweetNeoBrutalism"
        component={TweetNeoBrutalism}
        
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          tweetData: defaultTweetData,
          durationInFrames: defaultDurationInFrames
        }}
        calculateMetadata={({ props }) => {
          return {
            durationInFrames: props.durationInFrames || defaultDurationInFrames,
            fps: 30,
            width: 1080,
            height: 1080,
          };
        }}
      />
      <Composition
        id="TweetDarkCyber"
        component={TweetDarkCyber}
        
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          tweetData: defaultTweetData,
          durationInFrames: defaultDurationInFrames
        }}
        calculateMetadata={({ props }) => {
          return {
            durationInFrames: props.durationInFrames || defaultDurationInFrames,
            fps: 30,
            width: 1080,
            height: 1080,
          };
        }}
      />
      <Composition
        id="TweetAppleSaaS"
        component={TweetAppleSaaS}
        
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          tweetData: defaultTweetData,
          durationInFrames: defaultDurationInFrames
        }}
        calculateMetadata={({ props }) => {
          return {
            durationInFrames: props.durationInFrames || defaultDurationInFrames,
            fps: 30,
            width: 1080,
            height: 1080,
          };
        }}
      />
      <Composition
        id="TweetZoomCut"
        component={TweetZoomCut}

        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          tweetData: defaultTweetData,
          durationInFrames: defaultDurationInFrames
        }}
        calculateMetadata={({ props }) => {
          return {
            durationInFrames: props.durationInFrames || defaultDurationInFrames,
            fps: 30,
            width: 1080,
            height: 1080,
          };
        }}
      />
      <Composition
        id="Tweet3DPerspective"
        component={Tweet3DPerspective}

        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          tweetData: defaultTweetData,
          durationInFrames: defaultDurationInFrames
        }}
        calculateMetadata={({ props }) => {
          return {
            durationInFrames: props.durationInFrames || defaultDurationInFrames,
            fps: 30,
            width: 1080,
            height: 1080,
          };
        }}
      />
      <Composition
        id="TweetGlitchVHS"
        component={TweetGlitchVHS}

        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          tweetData: defaultTweetData,
          durationInFrames: defaultDurationInFrames
        }}
        calculateMetadata={({ props }) => {
          return {
            durationInFrames: props.durationInFrames || defaultDurationInFrames,
            fps: 30,
            width: 1080,
            height: 1080,
          };
        }}
      />
      <Composition
        id="TweetParticleBurst"
        component={TweetParticleBurst}

        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          tweetData: defaultTweetData,
          durationInFrames: defaultDurationInFrames
        }}
        calculateMetadata={({ props }) => {
          return {
            durationInFrames: props.durationInFrames || defaultDurationInFrames,
            fps: 30,
            width: 1080,
            height: 1080,
          };
        }}
      />
      <Composition
        id="TweetStarWars"
        component={TweetStarWars}

        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          tweetData: defaultTweetData,
          durationInFrames: defaultDurationInFrames
        }}
        calculateMetadata={({ props }) => {
          return {
            durationInFrames: props.durationInFrames || defaultDurationInFrames,
            fps: 30,
            width: 1080,
            height: 1080,
          };
        }}
      />
      <Composition
        id="TweetSpeedRead"
        component={TweetSpeedRead}

        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          tweetData: defaultTweetData,
          durationInFrames: defaultDurationInFrames
        }}
        calculateMetadata={({ props }) => {
          return {
            durationInFrames: props.durationInFrames || defaultDurationInFrames,
            fps: 30,
            width: 1080,
            height: 1080,
          };
        }}
      />
      <Composition
        id="TweetSubwaySurfers"
        component={TweetSubwaySurfers}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          tweetData: defaultTweetData,
          durationInFrames: defaultDurationInFrames
        }}
        calculateMetadata={({ props }) => {
          return {
            durationInFrames: props.durationInFrames || defaultDurationInFrames,
            fps: 30,
            width: 1080,
            height: 1080,
          };
        }}
      />
      <Composition
        id="TweetMinecraftParkour"
        component={TweetMinecraftParkour}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          tweetData: defaultTweetData,
          durationInFrames: defaultDurationInFrames
        }}
        calculateMetadata={({ props }) => {
          return {
            durationInFrames: props.durationInFrames || defaultDurationInFrames,
            fps: 30,
            width: 1080,
            height: 1080,
          };
        }}
      />
      <Composition
        id="TweetLofi"
        component={TweetLofi}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          tweetData: defaultTweetData,
          durationInFrames: defaultDurationInFrames
        }}
        calculateMetadata={({ props }) => {
          return {
            durationInFrames: props.durationInFrames || defaultDurationInFrames,
            fps: 30,
            width: 1080,
            height: 1080,
          };
        }}
      />
      <Composition
        id="TweetComicBook"
        component={TweetComicBook}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          tweetData: defaultTweetData,
          durationInFrames: defaultDurationInFrames
        }}
        calculateMetadata={({ props }) => {
          return {
            durationInFrames: props.durationInFrames || defaultDurationInFrames,
            fps: 30,
            width: 1080,
            height: 1080,
          };
        }}
      />
      <Composition
        id="TweetMatrix"
        component={TweetMatrix}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          tweetData: defaultTweetData,
          durationInFrames: defaultDurationInFrames
        }}
        calculateMetadata={({ props }) => {
          return {
            durationInFrames: props.durationInFrames || defaultDurationInFrames,
            fps: 30,
            width: 1080,
            height: 1080,
          };
        }}
      />
      <Composition
        id="TweetDisney"
        component={TweetDisney}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          tweetData: defaultTweetData,
          durationInFrames: defaultDurationInFrames
        }}
        calculateMetadata={({ props }) => {
          return {
            durationInFrames: props.durationInFrames || defaultDurationInFrames,
            fps: 30,
            width: 1080,
            height: 1080,
          };
        }}
      />
      <Composition
        id="TweetAnime"
        component={TweetAnime}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          tweetData: defaultTweetData,
          durationInFrames: defaultDurationInFrames
        }}
        calculateMetadata={({ props }) => {
          return {
            durationInFrames: props.durationInFrames || defaultDurationInFrames,
            fps: 30,
            width: 1080,
            height: 1080,
          };
        }}
      />
      <Composition
        id="TweetPokemon"
        component={TweetPokemon}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          tweetData: defaultTweetData,
          durationInFrames: defaultDurationInFrames
        }}
        calculateMetadata={({ props }) => {
          return {
            durationInFrames: props.durationInFrames || defaultDurationInFrames,
            fps: 30,
            width: 1080,
            height: 1080,
          };
        }}
      />
      <Composition
        id="TweetFortnite"
        component={TweetFortnite}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          tweetData: defaultTweetData,
          durationInFrames: defaultDurationInFrames
        }}
        calculateMetadata={({ props }) => {
          return {
            durationInFrames: props.durationInFrames || defaultDurationInFrames,
            fps: 30,
            width: 1080,
            height: 1080,
          };
        }}
      />

      <Composition
        id="TweetTechnicalExplainer"
        component={TweetTechnicalExplainer}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{
          tweetData: defaultTweetData,
          durationInFrames: defaultDurationInFrames
        }}
        calculateMetadata={({ props }) => {
          return {
            durationInFrames: props.durationInFrames || defaultDurationInFrames,
            fps: 30,
            width: 1080,
            height: 1080,
          };
        }}
      />
    </>
  );
};
