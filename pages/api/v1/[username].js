import { fetchDataForAllYears } from '../../../utils/fetch'

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  const { username, format } = req.query;
  const data = await fetchDataForAllYears(username, format);
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
  res.json(data);
}