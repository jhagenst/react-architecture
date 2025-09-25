import { getImageUrl } from './utils.js';

function Profile({ name, imageId, profession, awards, discovery }) {
  return (
    <section className="profile">
      <h2>{name}</h2>
      <img
        className="avatar"
        src={getImageUrl(imageId)}
        alt={name}
        width={70}
        height={70}
      />
      <ul>
        <li>
          <b>Profession: </b> 
          {profession}
        </li>
        <li>
          <b>Awards: {awards.count} </b> 
          ({awards.list})
        </li>
        <li>
          <b>Discovered: </b>
          {discovery}
        </li>
      </ul>
    </section>
  );
}

export default function Gallery() {
  return (
    <div>
      <h1>Notable Scientists</h1>
      <Profile
        name="Maria Skłodowska-Curie"
        imageId="szV5sdG"
        profession="physicist and chemist"
        awards={{
          count: 4,
          list: "Nobel Prize in Physics, Nobel Prize in Chemistry, Davy Medal, Matteucci Medal"
        }}
        discovery="polonium (chemical element)"
      />
      <Profile
        name="Katsuko Saruhashi"
        imageId="YfeOqp2"
        profession="geochemist"
        awards={{
          count: 2,
          list: "Miyake Prize for geochemistry, Tanaka Prize"
        }}
        discovery="a method for measuring carbon dioxide in seawater"
      />
    </div>
  );
}