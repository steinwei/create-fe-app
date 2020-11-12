import rp from 'request-promise';

function checkUpdates(name: string, version: string, registry: string) {
  return new Promise(function (resolve, reject) {
    const options = {
      url: `${registry}/${name}/${version}`,
      method: 'GET'
    };

    rp(options)
      .then(function (response) {
        response = JSON.parse(response);
        resolve(response);
      })
      .catch((err) => {
        resolve({err: err && err.message});
      });
  });
}

export default checkUpdates;