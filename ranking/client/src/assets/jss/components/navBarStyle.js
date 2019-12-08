import { container } from 'assets/jss/material-kit-react.js';
import headerLinksStyle from './headerLinksStyle';

const navBarsStyle = theme => ({
  container,
  header: {
    minHeight: '200px'
  },
  navbar: {
    marginBottom: '-20px',
    zIndex: '100',
    position: 'relative',
    overflow: 'hidden',
    '& header': {
      borderRadius: '0'
    }
  },
  headerOptionsRight: {
    '& div': {
      display: 'inline-block'
    }
  },
  navigation: {
    backgroundPosition: 'center center',
    backgroundSize: 'cover',
    marginTop: 0,
    minHeight: 740
  },
  formControl: {
    verticalAlign: 'unset',
    padding: 0,
    margin: 0
  },
  ...headerLinksStyle(theme),
  img: {
    width: '40px',
    height: '40px',
    borderRadius: '50%'
  },
  imageDropdownButton: {
    padding: '0px',
    top: '4px',
    borderRadius: '50%',
    marginLeft: '5px'
  }
});

export default navBarsStyle;
