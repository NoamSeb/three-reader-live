import s from "./Song.module.scss";
import AudioController from "../utils/AudioController";
import Scene from "../../webgl/Scene";

const Song = ({ data }) => {
  console.log(data);

  const pickSong = () =>{
    AudioController.updateSong(data.preview);
    Scene.cover.updateCover(data.album.cover_xl)
  }

  return (
    <>
      <div className={s.songInfo} onClick={pickSong}>
        <img src={data.album.cover_small}/>
        <div>
          <div>{data.title}</div>
          <div className={s.artistName}>{data.artist.name}</div>
        </div>
      </div>
    </>
  );
};
export default Song;
