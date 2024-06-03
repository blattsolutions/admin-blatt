import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Pagination, {paginationClasses} from '@mui/material/Pagination';

import {PostItemSkeleton} from './post-skeleton';
import PostItemHorizontal from './post-item-horizontal';

// ----------------------------------------------------------------------

export default function PostListHorizontal({posts, loading, page, totalPage, onChangePage}) {
  const renderSkeleton = (
    <>
      {[...Array(10)].map((_, index) => (
        <PostItemSkeleton key={index} variant="horizontal"/>
      ))}
    </>
  );

  const renderList = (
    <>
      {posts.map((post) => (
        <PostItemHorizontal key={post._id} post={post}/>
      ))}
    </>
  );

  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(2, 1fr)',
        }}
      >
        {loading ? renderSkeleton : renderList}
      </Box>

      {posts.length >= 10 && (
        <Pagination
          count={totalPage}
          page={page}
          sx={{
            mt: 8,
            [`& .${paginationClasses.ul}`]: {
              justifyContent: 'center',
            },
          }}
          onChange={(e, page) => {
            onChangePage?.(page)
          }}
        />
      )}
    </>
  );
}

PostListHorizontal.propTypes = {
  loading: PropTypes.bool,
  posts: PropTypes.array,
};
