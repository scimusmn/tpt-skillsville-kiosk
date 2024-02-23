import { useState, useEffect } from 'react';

export default function useCaptions(video, locale, show) {
  const [captions, setCaptions] = useState('');

  useEffect(() => {
    const textTrack = video.current?.textTracks.getTrackById(locale);

    function onCueChange() {
      textTrack.mode = 'hidden'; // Hide built-in captions of HTML5 video
      if (textTrack.activeCues.length) {
        setCaptions(textTrack.activeCues[0].text);
      }
      if (!show) setCaptions('');
    }

    textTrack.addEventListener('cuechange', onCueChange);

    return () => {
      textTrack.removeEventListener('cuechange', onCueChange);
    };
  }, []);

  return captions;
}
