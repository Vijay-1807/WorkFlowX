import React, { useState, useEffect, useRef } from 'react';

const Pupil = ({ size = 12, maxDistance = 5, pupilColor = "black", forceLookX, forceLookY }) => {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const pupilRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const calculatePupilPosition = () => {
    if (!pupilRef.current) return { x: 0, y: 0 };
    if (forceLookX !== undefined && forceLookY !== undefined) return { x: forceLookX, y: forceLookY };

    const pupil = pupilRef.current.getBoundingClientRect();
    const pupilCenterX = pupil.left + pupil.width / 2;
    const pupilCenterY = pupil.top + pupil.height / 2;
    const deltaX = mouseX - pupilCenterX;
    const deltaY = mouseY - pupilCenterY;
    const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance);
    const angle = Math.atan2(deltaY, deltaX);
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    return { x, y };
  };

  const pupilPosition = calculatePupilPosition();

  return (
    <div
      ref={pupilRef}
      style={{
        borderRadius: '50%',
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: pupilColor,
        transform: `translate(${pupilPosition.x}px, ${pupilPosition.y}px)`,
        transition: 'transform 0.1s ease-out',
      }}
    />
  );
};

const EyeBall = ({ size = 48, pupilSize = 16, maxDistance = 10, eyeColor = "white", pupilColor = "black", isBlinking = false, forceLookX, forceLookY }) => {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const eyeRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const calculatePupilPosition = () => {
    if (!eyeRef.current) return { x: 0, y: 0 };
    if (forceLookX !== undefined && forceLookY !== undefined) return { x: forceLookX, y: forceLookY };

    const eye = eyeRef.current.getBoundingClientRect();
    const eyeCenterX = eye.left + eye.width / 2;
    const eyeCenterY = eye.top + eye.height / 2;
    const deltaX = mouseX - eyeCenterX;
    const deltaY = mouseY - eyeCenterY;
    const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance);
    const angle = Math.atan2(deltaY, deltaX);
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    return { x, y };
  };

  const pupilPosition = calculatePupilPosition();

  return (
    <div
      ref={eyeRef}
      style={{
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.15s',
        width: `${size}px`,
        height: isBlinking ? '2px' : `${size}px`,
        backgroundColor: eyeColor,
        overflow: 'hidden',
      }}
    >
      {!isBlinking && (
        <div
          style={{
            borderRadius: '50%',
            width: `${pupilSize}px`,
            height: `${pupilSize}px`,
            backgroundColor: pupilColor,
            transform: `translate(${pupilPosition.x}px, ${pupilPosition.y}px)`,
            transition: 'transform 0.1s ease-out',
          }}
        />
      )}
    </div>
  );
};

const AnimatedCharacters = ({ passwordLength = 0, showPassword = false, isTyping = false }) => {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [isPurpleBlinking, setIsPurpleBlinking] = useState(false);
  const [isBlackBlinking, setIsBlackBlinking] = useState(false);
  const [isLookingAtEachOther, setIsLookingAtEachOther] = useState(false);
  const [isPurplePeeking, setIsPurplePeeking] = useState(false);
  
  const purpleRef = useRef(null);
  const blackRef = useRef(null);
  const yellowRef = useRef(null);
  const orangeRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const scheduleBlink = () => setTimeout(() => {
      setIsPurpleBlinking(true);
      setTimeout(() => { setIsPurpleBlinking(false); scheduleBlink(); }, 150);
    }, Math.random() * 4000 + 3000);
    const timeout = scheduleBlink();
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const scheduleBlink = () => setTimeout(() => {
      setIsBlackBlinking(true);
      setTimeout(() => { setIsBlackBlinking(false); scheduleBlink(); }, 150);
    }, Math.random() * 4000 + 3000);
    const timeout = scheduleBlink();
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (isTyping) {
      setIsLookingAtEachOther(true);
      const timer = setTimeout(() => setIsLookingAtEachOther(false), 800);
      return () => clearTimeout(timer);
    } else {
      setIsLookingAtEachOther(false);
    }
  }, [isTyping]);

  useEffect(() => {
    if (passwordLength > 0 && showPassword) {
      const schedulePeek = () => setTimeout(() => {
        setIsPurplePeeking(true);
        setTimeout(() => setIsPurplePeeking(false), 800);
      }, Math.random() * 3000 + 2000);
      const firstPeek = schedulePeek();
      return () => clearTimeout(firstPeek);
    } else {
      setIsPurplePeeking(false);
    }
  }, [passwordLength, showPassword, isPurplePeeking]);

  const calculatePosition = (ref) => {
    if (!ref.current) return { faceX: 0, faceY: 0, bodySkew: 0 };
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 3;
    const deltaX = mouseX - centerX;
    const deltaY = mouseY - centerY;
    const faceX = Math.max(-15, Math.min(15, deltaX / 20));
    const faceY = Math.max(-10, Math.min(10, deltaY / 30));
    const bodySkew = Math.max(-6, Math.min(6, -deltaX / 120));
    return { faceX, faceY, bodySkew };
  };

  const purplePos = calculatePosition(purpleRef);
  const blackPos = calculatePosition(blackRef);
  const yellowPos = calculatePosition(yellowRef);
  const orangePos = calculatePosition(orangeRef);

  return (
    <div className="animated-characters-container" style={{ position: 'relative', width: '450px', height: '350px', transform: 'scale(0.85)', transformOrigin: 'left center' }}>
      {/* Purple */}
      <div 
        ref={purpleRef}
        style={{
          position: 'absolute', bottom: 0, left: '50px', width: '150px',
          height: (isTyping || (passwordLength > 0 && !showPassword)) ? '380px' : '350px',
          backgroundColor: '#6C3FF5', borderRadius: '10px 10px 0 0', zIndex: 1,
          transition: 'all 0.7s ease-in-out', transformOrigin: 'bottom center',
          transform: (passwordLength > 0 && showPassword) ? 'skewX(0deg)' :
            (isTyping || (passwordLength > 0 && !showPassword)) ? `skewX(${(purplePos.bodySkew || 0) - 12}deg) translateX(40px)` : `skewX(${purplePos.bodySkew || 0}deg)`
        }}
      >
        <div style={{ position: 'absolute', display: 'flex', gap: '32px', transition: 'all 0.7s ease-in-out',
          left: (passwordLength > 0 && showPassword) ? '20px' : isLookingAtEachOther ? '55px' : `${45 + purplePos.faceX}px`,
          top: (passwordLength > 0 && showPassword) ? '35px' : isLookingAtEachOther ? '65px' : `${40 + purplePos.faceY}px`
        }}>
          <EyeBall size={18} pupilSize={7} eyeColor="white" pupilColor="#2D2D2D" isBlinking={isPurpleBlinking}
            forceLookX={(passwordLength > 0 && showPassword) ? (isPurplePeeking ? 4 : -4) : isLookingAtEachOther ? 3 : undefined}
            forceLookY={(passwordLength > 0 && showPassword) ? (isPurplePeeking ? 5 : -4) : isLookingAtEachOther ? 4 : undefined} />
          <EyeBall size={18} pupilSize={7} eyeColor="white" pupilColor="#2D2D2D" isBlinking={isPurpleBlinking}
            forceLookX={(passwordLength > 0 && showPassword) ? (isPurplePeeking ? 4 : -4) : isLookingAtEachOther ? 3 : undefined}
            forceLookY={(passwordLength > 0 && showPassword) ? (isPurplePeeking ? 5 : -4) : isLookingAtEachOther ? 4 : undefined} />
        </div>
      </div>

      {/* Black */}
      <div 
        ref={blackRef}
        style={{
          position: 'absolute', bottom: 0, left: '200px', width: '100px', height: '260px',
          backgroundColor: '#2D2D2D', borderRadius: '8px 8px 0 0', zIndex: 2,
          transition: 'all 0.7s ease-in-out', transformOrigin: 'bottom center',
          transform: (passwordLength > 0 && showPassword) ? 'skewX(0deg)' :
            isLookingAtEachOther ? `skewX(${(blackPos.bodySkew || 0) * 1.5 + 10}deg) translateX(20px)` :
            (isTyping || (passwordLength > 0 && !showPassword)) ? `skewX(${(blackPos.bodySkew || 0) * 1.5}deg)` : `skewX(${blackPos.bodySkew || 0}deg)`
        }}
      >
        <div style={{ position: 'absolute', display: 'flex', gap: '24px', transition: 'all 0.7s ease-in-out',
          left: (passwordLength > 0 && showPassword) ? '10px' : isLookingAtEachOther ? '32px' : `${26 + blackPos.faceX}px`,
          top: (passwordLength > 0 && showPassword) ? '28px' : isLookingAtEachOther ? '12px' : `${32 + blackPos.faceY}px`
        }}>
          <EyeBall size={16} pupilSize={6} eyeColor="white" pupilColor="#2D2D2D" isBlinking={isBlackBlinking}
            forceLookX={(passwordLength > 0 && showPassword) ? -4 : isLookingAtEachOther ? 0 : undefined}
            forceLookY={(passwordLength > 0 && showPassword) ? -4 : isLookingAtEachOther ? -4 : undefined} />
          <EyeBall size={16} pupilSize={6} eyeColor="white" pupilColor="#2D2D2D" isBlinking={isBlackBlinking}
            forceLookX={(passwordLength > 0 && showPassword) ? -4 : isLookingAtEachOther ? 0 : undefined}
            forceLookY={(passwordLength > 0 && showPassword) ? -4 : isLookingAtEachOther ? -4 : undefined} />
        </div>
      </div>

      {/* Orange */}
      <div 
        ref={orangeRef}
        style={{
          position: 'absolute', bottom: 0, left: '-20px', width: '200px', height: '170px',
          backgroundColor: '#FF9B6B', borderRadius: '100px 100px 0 0', zIndex: 3,
          transition: 'all 0.7s ease-in-out', transformOrigin: 'bottom center',
          transform: (passwordLength > 0 && showPassword) ? 'skewX(0deg)' : `skewX(${orangePos.bodySkew || 0}deg)`
        }}
      >
        <div style={{ position: 'absolute', display: 'flex', gap: '32px', transition: 'all 0.2s ease-out',
          left: (passwordLength > 0 && showPassword) ? '50px' : `${65 + (orangePos.faceX || 0)}px`,
          top: (passwordLength > 0 && showPassword) ? '85px' : `${70 + (orangePos.faceY || 0)}px`
        }}>
          <Pupil size={12} pupilColor="#2D2D2D" forceLookX={(passwordLength > 0 && showPassword) ? -5 : undefined} forceLookY={(passwordLength > 0 && showPassword) ? -4 : undefined} />
          <Pupil size={12} pupilColor="#2D2D2D" forceLookX={(passwordLength > 0 && showPassword) ? -5 : undefined} forceLookY={(passwordLength > 0 && showPassword) ? -4 : undefined} />
        </div>
      </div>

      {/* Yellow */}
      <div 
        ref={yellowRef}
        style={{
          position: 'absolute', bottom: 0, left: '260px', width: '120px', height: '190px',
          backgroundColor: '#E8D754', borderRadius: '60px 60px 0 0', zIndex: 4,
          transition: 'all 0.7s ease-in-out', transformOrigin: 'bottom center',
          transform: (passwordLength > 0 && showPassword) ? 'skewX(0deg)' : `skewX(${yellowPos.bodySkew || 0}deg)`
        }}
      >
        <div style={{ position: 'absolute', display: 'flex', gap: '24px', transition: 'all 0.2s ease-out',
          left: (passwordLength > 0 && showPassword) ? '20px' : `${42 + (yellowPos.faceX || 0)}px`,
          top: (passwordLength > 0 && showPassword) ? '35px' : `${30 + (yellowPos.faceY || 0)}px`
        }}>
          <Pupil size={12} pupilColor="#2D2D2D" forceLookX={(passwordLength > 0 && showPassword) ? -5 : undefined} forceLookY={(passwordLength > 0 && showPassword) ? -4 : undefined} />
          <Pupil size={12} pupilColor="#2D2D2D" forceLookX={(passwordLength > 0 && showPassword) ? -5 : undefined} forceLookY={(passwordLength > 0 && showPassword) ? -4 : undefined} />
        </div>
        <div style={{
          position: 'absolute', width: '60px', height: '4px', backgroundColor: '#2D2D2D', borderRadius: '4px', transition: 'all 0.2s ease-out',
          left: (passwordLength > 0 && showPassword) ? '10px' : `${30 + (yellowPos.faceX || 0)}px`,
          top: (passwordLength > 0 && showPassword) ? '70px' : `${70 + (yellowPos.faceY || 0)}px`
        }} />
      </div>
    </div>
  );
};

export default AnimatedCharacters;
