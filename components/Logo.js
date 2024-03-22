import Link from "next/link";

const Logo = () => {
  return (
    <Link href={"/"} className="flex gap-1">
      <span className="">
        <img
          src="https://res.cloudinary.com/dqgachhdt/image/upload/v1711112415/hoqdfgoh9vf1dift6doy.webp"
          alt=""
          width="170"
          height="170"
        />
      </span>
    </Link>
  );
};

export default Logo;
