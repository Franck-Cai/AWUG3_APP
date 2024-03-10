import './Cards.css'

export default function Characters({ characters }) {
    return (
      <div className="characterList">
        {characters &&
          characters.map((character) => (
            <div key={character.id} className="card">
              <img className="characterImage" src={character.image} alt={character.name} />
              <h3 className="characterTxt name">{character.name}</h3>
                  <p className="characterTxt status">{character.status}</p>
              <div className="info">
                <p><i class="material-icons">help_outline</i> More info</p>
                <div className="popup-info">
                  <p className="charTxt species ">Species: {character.species}</p>
                  <p className="charTxt species"></p>
                  <p className="charTxt type ">Type: {character.type ? character.type : "Unknown"}</p>
                  <p className="charTxt type"></p>
                  <p className="charTxt gender ">Gender: {character.gender}</p>
                  <p className="charTxt gender"></p>
                </div>
                </div>
                
            </div>
          ))}
      </div>
    );
  }