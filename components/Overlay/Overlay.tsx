import React from 'react';

interface Props {
  onClick(): void;
}

function Overlay({ onClick }: Props) {
  return (
    <div className="Overlay" onClick={onClick} />
  )
}

export default Overlay;
