
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import "../css/SocialLinks.css";

const SocialLinks = () => {
  const socials = [
    {
      name: "Instagram",
      url: 'https://instagram.com/kasoa.app',
      icon: <FaInstagram />,
      className: "instagram",
    },
    {
      name: "Facebook",
      url: 'https://facebook.com/kasoa.apk',
      icon: <FaFacebookF />,
      className: "facebook",
    },
    {
      name: "TikTok",
      url: 'https://tiktok.com/@kasoa.app',
      icon: <FaTiktok />,
      className: "tiktok",
    },
  ];

  const activeSocials = socials.filter(
    (social) => social.url?.trim()
  );

  if (!activeSocials.length) return null;

  return (
    <div className={`social-links`}>
      {activeSocials.map((social) => (
       <div className={social.className} key={social.name}>
         <a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visit Kasoa on ${social.name}`}
          title={social.name}
          className={`social-links__item social-links__item--${social.className}`}
        >
          {social.icon}
        </a>
       </div>
      ))}
    </div>
  );
};

export default SocialLinks;
