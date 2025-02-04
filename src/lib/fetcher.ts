import axios from "axios";

type Props = {
  url: string;
  data?: any;
  method?: string;
};

const fetcher = async (url: string, data?: any, method?: string) => {
  console.log(url);
  // const method = props.method ?? "get";
  // console.log(props);
  return axios({ url, data, method: method ?? "get" }).then((res) => res.data);
};

export default fetcher;
