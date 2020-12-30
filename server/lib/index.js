const ptt = require('parse-torrent-title');
const path = require('path');

exports.getEpisodeInfo = function(filename) {
  filename = path.basename(filename);

  const info = {
    serie: null,
    season: null,
    episode: null,
    lang: null
  };
  const { title } = ptt.parse(filename);
  if (title) info.serie = title;

  filename = filename.toUpperCase();

  if (filename.includes('FRENCH')) info.lang = 'VF';
  if (filename.includes('SUBFRENCH')) info.lang = 'VOSTFR';

  if (filename.includes('VF')) info.lang = 'VF';
  if (filename.includes('VO')) info.lang = 'VO';
  if (filename.includes('VOST')) info.lang = 'VOST';
  if (filename.includes('VOSTFR')) info.lang = 'VOSTFR';
  if (filename.includes('MULTI')) info.lang = 'MULTI';

  const regexResult = /(S(?<season>\d{1,3}))?(E(?<episode>\d{1,3}))/gim.exec(filename);

  if (regexResult) {
    const {
      groups: { season, episode }
    } = regexResult;

    info.season = season ? parseInt(season, 10) : null;
    info.episode = episode ? parseInt(episode, 10) : null;
  }

  return info;
};

exports.getFilmInfo = function(filename) {
  filename = path.basename(filename);

  const info = {
    name: null,
    year: null,
    lang: null,
    UHD: false
  };

  const { title, year } = ptt.parse(filename);
  if (title) info.name = title;
  if (year) info.year = year;

  filename = filename.toUpperCase();

  if (filename.includes('FRENCH')) info.lang = 'VF';
  if (filename.includes('SUBFRENCH')) info.lang = 'VOSTFR';

  if (filename.includes('VF')) info.lang = 'VF';
  if (filename.includes('VO')) info.lang = 'VO';
  if (filename.includes('VOST')) info.lang = 'VOST';
  if (filename.includes('VOSTFR')) info.lang = 'VOSTFR';
  if (filename.includes('MULTI')) info.lang = 'MULTI';

  if (filename.includes('UHD') || filename.includes('2160P') || filename.includes('4K')) info.UHD = true;

  return info;
};
