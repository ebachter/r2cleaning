export async function getOauthToken() {
  try {
    const resData = await fetch(
      `${process.env.REACT_APP_API_ORIGIN}/auth/twitter/reverse`,
      {method: 'POST', cache: 'no-cache'},
    );
    const data = await resData.json();

    return [null, data];
  } catch (err) {
    console.error({info: 'loadObjects', message: err});
    return [err, null];
  }
}

export async function getOauthTokenGoogle() {
  // console.log('getOauthToken')
  try {
    const resData = await fetch(
      `${process.env.REACT_APP_API_ORIGIN}/auth/google/reverse`,
      {method: 'POST', cache: 'no-cache'},
    );
    const data = await resData.json();

    return [null, data];
  } catch (err) {
    console.error({info: 'loadObjects', message: err});
    return [err, null];
  }
}
