export const parsePusher = async (body) => {
  let object = {};
  console.log(body);
  const textData = await new Response(body).text();
  const splitTextData = textData.split("&").forEach((item) => {
    const splitItem = item.split("=");
    object[splitItem[0]] = splitItem[1];
  });
  return object;
};
