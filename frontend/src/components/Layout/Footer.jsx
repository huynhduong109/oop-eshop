import React from "react";
import logo from "../../Assests/Image/FourD.png";
import "../CSS/Footer.css";
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillYoutube,
  AiOutlineTwitter,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import {
  footercompanyLinks,
  footerProductLinks,
  footerSupportLinks,
} from "../../static/data";

const Footer = () => {
  const facebookLink =
    "https://www.facebook.com/profile.php?id=100022564877394";
  const instagramLink = "https://www.instagram.com/h_duong.02/";
  const twitterLink = "https://www.twitter.com/example";
  const youtubeLink = "https://www.youtube.com/@Sontungmtp";

  return (
    <div className="bg-[#000] text-white">
      <div className="grid grid-cols-1 sm:gird-cols-3 lg:grid-cols-4 gap-6 sm:px-8 px-5 py-16 sm:text-center md:grid-cols-2">
        <ul className=" text-center md:text-start flex md:block flex-col items-center">
          <img
            src={logo}
            alt=""
            style={{ filter: "brightness(0) invert(1)", width: "265px" }}
          />
          <br />
          <p>Thuận mua, vừa bán</p>
          <div className="flex items-center mt-[15px]">
            <a href={facebookLink} target="_blank" rel="noopener noreferrer">
              <AiFillFacebook size={25} className="cursor-pointer" />
            </a>
            <a
              href={twitterLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ marginLeft: "15px", cursor: "pointer" }}>
              <AiOutlineTwitter size={25} />
            </a>
            <a
              href={instagramLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ marginLeft: "15px", cursor: "pointer" }}>
              <AiFillInstagram size={25} />
            </a>
            <a
              href={youtubeLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ marginLeft: "15px", cursor: "pointer" }}>
              <AiFillYoutube size={25} />
            </a>
          </div>
        </ul>

        <ul className="text-center md:text-start">
          <h1 className="mb-1 font-semibold">Công ty</h1>
          {footerProductLinks.map((link, index) => (
            <li key={index}>
              <Link
                className="text-gray-400 hover:text-teal-400 duration-300
                   text-sm cursor-pointer leading-6"
                to={link.link}>
                {link.name}
              </Link>
            </li>
          ))}
          <div className=" md:text-start Footer_map">
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1408.8421903166866!2d106.61546444161638!3d10.869635660552424!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752bc5e58430d9%3A0x9ce6ec40c09baf25!2sKTX%20Mini%20Happy%20House!5e0!3m2!1svi!2s!4v1690725162915!5m2!1svi!2s"
              width="250"
              height="150"
              style={{ borderRadius: "5px" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"></iframe>
          </div>
        </ul>

        <ul className="text-center md:text-start">
          <h1 className="mb-1 font-semibold">Sản phẩm</h1>
          {footercompanyLinks.map((link, index) => (
            <li key={index}>
              <Link
                className="text-gray-400 hover:text-teal-400 duration-300
                   text-sm cursor-pointer leading-6"
                to={link.link}>
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        <ul className="text-center md:text-start">
          <h1 className="mb-1 font-semibold">Chăm sóc khách hàng</h1>
          {footerSupportLinks.map((link, index) => (
            <li key={index}>
              <Link
                className="text-gray-400 hover:text-teal-400 duration-300
                   text-sm cursor-pointer leading-6"
                to={link.link}>
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10
         text-center pt-2 text-gray-400 text-sm pb-8 ">
        <span>© 2023 4D Market. All rights reserved.</span>
        <span>Terms · Privacy policy</span>
        <div className="sm:block flex items-center justify-center w-full footer_logo-payment">
          <img
            src="https://hamart-shop.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ffooter-payment.a37c49ac.png&w=640&q=75"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default Footer;
