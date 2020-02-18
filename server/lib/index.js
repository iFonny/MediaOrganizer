exports.getEpisodeInfo = function(filename) {
  filename = filename.toUpperCase();

  const info = {
    season: null,
    episode: null,
    lang: null
  };

  if (filename.includes('VF')) info.lang = 'VF';
  if (filename.includes('VO')) info.lang = 'VO';
  if (filename.includes('VOST')) info.lang = 'VOST';
  if (filename.includes('VOSTFR')) info.lang = 'VOSTFR';
  if (filename.includes('MULTI')) info.lang = 'MULTI';

  const {
    groups: { season, episode }
  } = /(S(?<season>\d{1,3}))?(E(?<episode>\d{1,3}))/gim.exec(filename);
  info.season = season ? parseInt(season, 10) : null;
  info.episode = episode ? parseInt(episode, 10) : null;

  return info;
};
