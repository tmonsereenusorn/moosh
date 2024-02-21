import logo from "../assets/moosh_logo.svg";

export const Logo = ({ width = 32, height = 32, color = "#FFFFFF" }) => {
  return (
    <img color="#F87171" src={logo} width={width} height={height} alt="" />
  );
};
