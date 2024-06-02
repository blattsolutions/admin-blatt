import {Helmet} from 'react-helmet-async';

import {useParams} from 'src/routes/hooks';

import {PostDetailsHomeView} from 'src/sections/blog/view';

// ----------------------------------------------------------------------

export default function PostDetailsHomePage() {
  const {title} = useParams();
  const query = new URLSearchParams(window.location.search);
  const id = query.get('id') || '';
  console.log(id)

  return (
    <>
      <Helmet>
        <title> Post: Details</title>
      </Helmet>

      <PostDetailsHomeView title={`${title}`} id={id}/>
    </>
  );
}
