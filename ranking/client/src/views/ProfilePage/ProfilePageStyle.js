import imagesStyles from "assets/jss/imagesStyles";
import {container, title} from 'assets/jss/material-kit-react'
import headerLinksStyle from "assets/jss/components/headerLinksStyle";

const profilePageStyle = theme => ({
  container,
  title,
  ...imagesStyles,
  picture: {
    borderRadius: '50%',
    backgroundColor: '#666',
    width: 160,
    height: 160,
    margin: '0 auto',
    color: '#fff',
    fontSize: 70,
    lineHeight: '160px'
  },
  profile: {
    textAlign: 'center',
    transform: 'translate3d(0, -80px, 0)',
    
    '& img': {
      maxWidth: '160px',
      width: '100%',
      margin: '0 auto'
    }
  },
  main: {
    background: '#FFFFFF',
    position: 'relative',
    zIndex: '3'
  },
  mainRaised: {
    margin: '0 30px 0px',
    borderRadius: '6px',
    boxShadow:
      '0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)'
  },
  ...headerLinksStyle(theme)
});

export default profilePageStyle;
