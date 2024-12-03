import {useCallback} from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Pagination, {paginationClasses} from '@mui/material/Pagination';

import {paths} from 'src/routes/paths';
import {useRouter} from 'src/routes/hooks';

import JobItem from './job-item';

// ----------------------------------------------------------------------

export default function JobList({jobs, totalPage, onPageChange}) {
  const router = useRouter();
  const handleView = useCallback(
    (id) => {
      router.push(paths.dashboard.form.details(id));
    },
    [router]
  );

  const handleEdit = useCallback(
    (id) => {
      router.push(paths.dashboard.form.edit(id));
    },
    [router]
  );

  const handleDelete = useCallback((id) => {
    console.info('DELETE', id);
  }, []);

  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
      >
        {jobs.map((job) => (
          <JobItem
            key={job._id}
            job={job}
            onView={() => handleView(job._id)}
            onEdit={() => handleEdit(job.id)}
            onDelete={() => handleDelete(job.id)}
          />
        ))}
      </Box>

      {totalPage > 2 && (
        <Pagination
          count={totalPage}
          onChange={(_, page) => onPageChange?.(page)}
          sx={{
            mt: 8,
            [`& .${paginationClasses.ul}`]: {
              justifyContent: 'center',
            },
          }}
        />
      )}
    </>
  );
}

JobList.propTypes = {
  jobs: PropTypes.array,
  totalPage: PropTypes.number,
  onPageChange: PropTypes.func
};
