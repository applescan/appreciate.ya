'use client'
import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_POSTS_BY_SPECIFIC_AUTHOR } from '@/graphql/queries';
import PostCard from '@/components/ui/PostCard';
import Button from "@/components/Button";
import { RiHeartAddLine } from "react-icons/ri";
import { useRouter } from 'next/navigation';
import { Post } from '@/lib/types/types';
import Loading from '@/components/ui/Loading';
import { capitalizeEachWord, formatTime } from '@/helpers/helpers';
import { useSession } from 'next-auth/react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup
} from "@/components/ui/Dropdown";

const UserPostPage = () => {
  const { data: sessionData } = useSession();
  const currentOrgId = parseInt(sessionData?.user?.orgId);
  const currentUserId = parseInt(sessionData?.user?.id);
  const [selectedFilter, setSelectedFilter] = useState('MONTH');

  const { loading, error, data, refetch } = useQuery(GET_POSTS_BY_SPECIFIC_AUTHOR, {
    variables: { orgId: currentOrgId, authorId: currentUserId, filter: { type: selectedFilter } },
  });

  const router = useRouter();

  function extractImageUrlFromContent(content: string) {
    // Regular expression to match Markdown image syntax
    const regex = /!\[.*?\]\((.*?)\)/;
    const matches = content.match(regex);

    // If matches found, return the first captured group, which is the URL
    if (matches && matches[1]) {
      return matches[1];
    }

    // If no matches, return a default image or an empty string
    return '';
  }

  function removeImageUrlFromContent(content: string) {
    // Regular expression to match Markdown image syntax
    const regex = /!\[.*?\]\(.*?\)/g;
    return content.replace(regex, '').trim();
  }

  if (loading) return <Loading />;
  if (error) return <p>Error: {error.message}</p>;


  const handleFilterSelect = (value: string) => {
    const filterType = value
    setSelectedFilter(filterType);
    refetch({ orgId: currentOrgId, filter: { type: filterType } });
  };

  return (
    <>
      <div className='pb-5 flex justify-between'>
        <Button className='p-2 rounded-md text-sm border bg-gradient-to-r from-pink-500 to-indigo-500 hover:from-pink-400 hover:to-indigo-400 text-white'
          onClick={() => router.push('/add')}>
          <div className='flex items-center gap-2'>
            <RiHeartAddLine />Send Kudos</div>
        </Button>
        <div className='flex min-w-fit items-center gap-2'>
          <span className='text-gray-500 font-normal text-sm min-w-[55px]'>Filter by</span>
          <div className='w-[150px]'>
            <Select onValueChange={handleFilterSelect}>
              <SelectTrigger aria-label="Filter">
                <SelectValue placeholder={capitalizeEachWord(selectedFilter)}>{capitalizeEachWord(selectedFilter)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem key="month" value="MONTH">
                    Month
                  </SelectItem>
                  <SelectItem key="quarter" value="QUARTER">
                    Quarter
                  </SelectItem>
                  <SelectItem key="year" value="YEAR">
                    Year
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {data.postsBySpecificSender ? (
          data.postsBySpecificSender.map((post: Post) => (
            <PostCard
              key={post.id}
              authorName={post.author.name}
              authorImage={post.author.image || 'default-avatar-url'}
              postImage={extractImageUrlFromContent(post.content)}
              recipient={post.recipient.name}
              content={removeImageUrlFromContent(post.content)}
              postTime={formatTime(post.createdAt)}
            />
          ))
        ) : (
          <p>No posts found</p>
        )}
      </div>
    </>
  );
};

export default UserPostPage;