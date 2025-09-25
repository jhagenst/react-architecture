import { getImageUrl } from './utils.js';

function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person.imageId, size < 90 ? 's' : 'b')}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <div>
      <h1>Avatar Size Test</h1>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <p>Size 40 (should use 's')</p>
          <Avatar
            size={40}
            person={{ 
              name: 'Gregorio Y. Zara', 
              imageId: '7vQD0fP'
            }}
          />
        </div>
        <div>
          <p>Size 80 (should use 's')</p>
          <Avatar
            size={80}
            person={{ 
              name: 'Gregorio Y. Zara', 
              imageId: '7vQD0fP'
            }}
          />
        </div>
        <div>
          <p>Size 90 (should use 'b')</p>
          <Avatar
            size={90}
            person={{ 
              name: 'Gregorio Y. Zara', 
              imageId: '7vQD0fP'
            }}
          />
        </div>
        <div>
          <p>Size 120 (should use 'b')</p>
          <Avatar
            size={120}
            person={{ 
              name: 'Gregorio Y. Zara', 
              imageId: '7vQD0fP'
            }}
          />
        </div>
      </div>
    </div>
  );
}