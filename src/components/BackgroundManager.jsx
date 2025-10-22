
const BackgroundManager = ({ children, background, opacity }) => {
  const bgStyle = {
    position: 'relative',
    minHeight: '100vh'
  };

  const bgImageStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: background ? `url(${background})` : 'none',
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed',
    backgroundPosition: 'center',
    zIndex: -1,
    opacity: opacity
  };


  const themeOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'var(--theme-overlay-color)',
    opacity: 0.1,
    zIndex: -1,
    pointerEvents: 'none'
  };

  return (
    <div style={bgStyle}>
      <div style={bgImageStyle}></div>
      <div style={themeOverlayStyle}></div>
      {children}
    </div>
  );
};

export default BackgroundManager;
