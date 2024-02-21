import logo from "../assets/spotify_logo.svg";

export const SpotifyLogo = ({ width = 32, height = 32 }) => {
  return (
    <img color="#F87171" src={logo} width={width} height={height} alt="" />
  );
};
