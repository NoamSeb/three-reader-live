import s from "./Search.module.scss";
import fetchJsonp from "fetch-jsonp";
import useCustomStore from "../../customStore";
import { useEffect, useState } from "react";
import AudioController from "../utils/AudioController";
import { useDropzone } from "react-dropzone";

const Search = () => {
  const [artist, setArtist] = useState("");
  const setSongs = useCustomStore((state) => state.setSongs);
  
  const onDrop = (audio) => {
    console.log(audio);
    const src = URL.createObjectURL(audio[0]);

    const audioObject = {
        album: {
            cover: "",
        },
        artist: {
            name: "",
        },
        preview: src,
        title: audio[0].name,
    };

    setSongs([audioObject]);

};

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "audio/mpeg": [".mp3"],
    },
  });

  useEffect(() => {
    AudioController.setup();
  }, []);

  const onKeyDown = (e) => {
    if (e.keyCode === 13 && e.target.value !== "") {
      getSongs();
    }
  };

  const getSongs = async () => {
    let response = await fetchJsonp(
      `https://api.deezer.com/search?q=${artist}&output=jsonp`
    );

    response = await response.json();

    const data = response.data.slice(0, 10);
    AudioController.ctx.resume();
    setSongs(data);
    setArtist("");
  };
  console.log(isDragActive);
  return (
    <div className={s.searchWrapper} {...getRootProps()}>
      <input
        type="text"
        value={artist}
        placeholder="Search or Drag"
        onChange={(e) => setArtist(e.target.value)}
        onKeyDown={onKeyDown}
      />

      {isDragActive && <input {...getInputProps()} />}
    </div>
  );
};
export default Search;
