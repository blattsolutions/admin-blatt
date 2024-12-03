import orderBy from 'lodash/orderBy';
import { useState, useEffect, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import { GridSearchIcon } from '@mui/x-data-grid';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

// import {useDebounce} from 'src/hooks/use-debounce';

import { useGetPosts } from 'src/api/blog'; // useSearchPosts
import { POST_SORT_OPTIONS } from 'src/_mock';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import PostSort from '../post-sort';
// import PostSearch from '../post-search';
import axios from '../../../utils/axios';
import PostListHorizontal from '../post-list-horizontal';
import useDebouncedValue from '../../../hooks/useDebouncedValue';

// ----------------------------------------------------------------------

const defaultFilters = {
  publish: 'all',
};

// ----------------------------------------------------------------------

export default function PostListView() {
  const settings = useSettingsContext();

  const [sortBy, setSortBy] = useState('latest');

  const [postSize, setPostSize] = useState({
    all: 0,
    published: 0,
    draft: 0,
  });

  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState(defaultFilters);

  const [searchQuery, setSearchQuery] = useState('');

  // const debouncedQuery = useDebounce(searchQuery);

  // const {posts, postsLoading} = useGetPosts(page, sortBy, filters, searchQuery);

  // const {searchResults, searchLoading} = useSearchPosts(debouncedQuery);

  const debouncedQuery = useDebouncedValue(searchQuery, 500);

  const { posts, postsLoading } = useGetPosts(page, sortBy, filters, debouncedQuery);

  // const { searchResults, searchLoading } = useSearchPosts(debouncedQuery);

  const dataFiltered = applyFilter({
    inputData: posts,
    filters,
    sortBy,
  });

  const handleSortBy = useCallback((newValue) => {
    setSortBy(newValue);
  }, []);

  const handleFilters = useCallback((name, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setPage(1);
  }, []);

  const handleSearch = useCallback((inputValue) => {
    setSearchQuery(inputValue);
  }, []);

  const handleFilterPublish = useCallback(
    (event, newValue) => {
      handleFilters('publish', newValue);
    },
    [handleFilters]
  );
  useEffect(() => {
    axios.get('/api/admin/total-blog').then(({ data }) => {
      setPostSize((prevState) => ({
        all: data.totalPublished + data.totalDraft,
        published: data.totalPublished,
        draft: data.totalDraft,
      }));
    });
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="List"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Blog',
            href: paths.dashboard.post.root,
          },
          {
            name: 'List',
          },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.post.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Post
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Stack
        spacing={3}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-end', sm: 'center' }}
        direction={{ xs: 'column', sm: 'row' }}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        <TextField
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search posts..."
          variant="outlined"
          sx={{ mb: { xs: 3, md: 5 }, width: '400px' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <GridSearchIcon />
              </InputAdornment>
            ),
          }}
        />
        
        {/*  <PostSearch */}
        {/*  query={debouncedQuery} */}
        {/*  results={searchResults} */}
        {/*  onSearch={handleSearch} */}
        {/*  loading={searchLoading} */}
        {/*  hrefItem={(title) => paths.dashboard.post.details(title)} */}
        {/*  /> */}

        <PostSort sort={sortBy} onSort={handleSortBy} sortOptions={POST_SORT_OPTIONS} />
      </Stack>

      <Tabs
        value={filters.publish}
        onChange={handleFilterPublish}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {['all', 'published', 'draft'].map((tab) => (
          <Tab
            key={tab}
            iconPosition="end"
            value={tab}
            label={tab}
            icon={
              <Label
                variant={((tab === 'all' || tab === filters.publish) && 'filled') || 'soft'}
                color={(tab === 'published' && 'info') || 'default'}
              >
                {tab === 'all' && postSize?.all}

                {tab === 'published' && postSize?.published}

                {tab === 'draft' && postSize?.draft}
              </Label>
            }
            sx={{ textTransform: 'capitalize' }}
          />
        ))}
      </Tabs>

      <PostListHorizontal
        posts={dataFiltered}
        loading={postsLoading}
        page={page}
        totalPage={Math.ceil(postSize[filters.publish] / 10)}
        onChangePage={(newPage) => {
          setPage(newPage);
        }}
      />
    </Container>
  );
}

// ----------------------------------------------------------------------

const applyFilter = ({ inputData, filters, sortBy }) => {
  const { publish } = filters;

  if (sortBy === 'latest') {
    inputData = orderBy(inputData, ['createdAt'], ['desc']);
  }

  if (sortBy === 'oldest') {
    inputData = orderBy(inputData, ['createdAt'], ['asc']);
  }

  if (publish !== 'all') {
    // inputData = inputData.filter((post) => post.publish === publish);
  }

  return inputData;
};
