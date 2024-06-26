import { View, Text, FlatList, Image, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import useAppwrite from '../../lib/useAppwrite';
import { getAllPosts, getLatestPosts } from '../../lib/appwrite';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '@/constants';
import SearchInput from '@/components/SearchInput';
import Trending from '@/components/Trending';
import EmptyState from '@/components/EmptyState';
import VideoCard from '@/components/VideoCard';

interface Post {
    $id: string;
    title: string;
    // include other properties if there are any
}

const Home = () => {
    const { data: posts, refetch } = useAppwrite(getAllPosts);
    const { data: latestPosts } = useAppwrite(getLatestPosts);
    const [isLoading, setIsLoading] = useState(true);

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };
    console.log('latestPosts: ', latestPosts);
    return (
        <SafeAreaView className="bg-primary h-full">
            <FlatList
                data={posts}
                keyExtractor={(item) => item.$id}
                renderItem={({ item }) => (
                    // <Text className="text-3xl text-white">{item.title} </Text>
                    <VideoCard
                        title={item.title}
                        thumbnail={item.thumbnail}
                        video={item.video}
                        creator={item.creator.username}
                        avatar={item.creator.avatar}
                    />
                )}
                ListHeaderComponent={() => (
                    <View className="flex my-6 px-4 space-y-6">
                        <View className="flex justify-between items-justify flex-row mb-6">
                            <View>
                                <Text className="font-pmedium text-sm text-gray-100">
                                    Welcome back
                                </Text>
                                <Text className="text-2xl font-psemibold text-white">
                                    JS Master
                                </Text>
                            </View>
                            <View className="mt-1.5">
                                <Image
                                    source={images.logoSmall}
                                    className="w-9 h-10"
                                    resizeMode="contain"
                                />
                            </View>
                        </View>
                        <SearchInput initialQuery="" />
                        <View className="w-full flex-1 pt-5 pb-8">
                            <Text className="text-gray-100 text-lg font-pregular mb-3">
                                Latest Videos
                            </Text>
                            <Trending posts={latestPosts ?? []} />
                        </View>
                    </View>
                )}
                // display if data is empty
                ListEmptyComponent={() => (
                    <EmptyState
                        title="No Videos found"
                        subtitle="Be the first one to create one"
                    />
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            />
        </SafeAreaView>
    );
};

export default Home;
