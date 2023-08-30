const IconLegend = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
    <div className='icon-container'>
      <div style={{ fontSize: '1.5rem', padding: '0.25rem' }}>#</div>
      <p>Next Lizard</p>
    </div>
    <div className='icon-container'>
      <img className='image' src='/bonus.svg' />
      <p>Invincibility</p>
    </div>
    <div className='icon-container'>
      <img className='image' src='/booby-trap.svg' />
      <p>Controls Disabled</p>
    </div>
  </div>
);

export default IconLegend;
