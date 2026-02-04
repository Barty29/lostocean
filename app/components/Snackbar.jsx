import SuccesIcon from '~/assets/success3.svg';
import ErrorIcon from '~/assets/error.svg';
import CloseIcon from '~/assets/close-icon.svg';
import {motion} from 'framer-motion';

const Snackbar = ({message, type, onClose}) => {
  return (
    <motion.div
      initial={{opacity: 0, y: 16}}
      animate={{opacity: 1, y: 0}}
      exit={{opacity: 0, y: 16}}
      transition={{
        duration: 0.3,
        ease: 'easeOut',
      }}
      className={`snackbar snackbar-${type}`}
    >
      <img
        src={type === 'success' ? SuccesIcon : ErrorIcon}
        alt={type}
        className="snackbar-icon"
        width="30px"
        height="30px"
      />
      <div className="snackbar-content">{message}</div>
      <button className="snackbar-close" onClick={onClose}>
        <img
          src={CloseIcon}
          alt={type}
          className="snackbar-icon"
          width="16px"
          height="16px"
        />
      </button>
    </motion.div>
  );
};

export default Snackbar;
