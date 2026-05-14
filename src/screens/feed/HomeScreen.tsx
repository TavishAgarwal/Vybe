import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  StyleSheet, View, FlatList, Dimensions, ActivityIndicator,
  ViewToken, RefreshControl, Text, Share, Platform, Image,
  TouchableOpacity,
} from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useFeed, useActiveChallenge } from '../../hooks';
import { useFeedStore } from '../../stores/feedStore';
import { CommentSheet } from '../../components';
import { colors, spacing, typography } from '../../theme';
import { Pill } from '../../components/ui';
import { Entry, User } from '../../types/models';
import { Heart, MessageCircle, Share2 } from 'lucide-react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

const { width: SW, height: SH } = Dimensions.get('window');

const mk = (id:string,h:string,n:string,img:number,s:number,f:number): User => ({
  id, handle:h, username:h, displayName:n,
  avatarUrl:`https://i.pravatar.cc/150?img=${img}`, bio:'',
  categories:[], vybeScore:s, vybeCoins:0, strikeCount:0,
  pledgeSigned:true, createdAt:'2026-01-01',
  followersCount:f, followingCount:Math.floor(f*0.03),
});

const U: User[] = [
  mk('u1','sarah_vibes','Sarah Chen',1,1250,12400),
  mk('u2','dj_marcus','Marcus Rivera',3,2100,28700),
  mk('u3','luna_art','Luna Park',5,890,8900),
  mk('u4','alex.moves','Alex Kim',7,1780,19200),
  mk('u5','chef_maya','Maya Singh',9,650,5400),
  mk('u6','joker_pete','Pete Lawson',11,3200,45100),
  mk('u7','fit_nina','Nina Torres',16,920,11300),
  mk('u8','travel_jay','Jay Patel',12,540,7600),
  mk('u9','gamer_zoe','Zoe Wang',20,1450,22800),
  mk('u10','style_emma','Emma Brooks',24,780,9800),
  mk('u11','diy_mike','Mike Johnson',33,430,4200),
  mk('u12','petlover_lily','Lily Adams',26,620,6700),
  mk('u13','sam_beats','Sam Okafor',13,1100,15600),
  mk('u14','anna_lens','Anna M.',25,870,10200),
  mk('u15','raj_code','Raj Patel',14,560,6100),
  mk('u16','bella_bakes','Bella T.',27,490,5800),
  mk('u17','kai_surfs','Kai Nakamura',15,710,8400),
  mk('u18','tara_yoga','Tara Santos',28,830,9700),
  mk('u19','leo_comedy','Leo Garcia',17,1300,18500),
  mk('u20','jess_plants','Jess Liu',29,380,4500),
  mk('u21','omar_ball','Omar Hassan',18,950,12100),
  mk('u22','mia_sings','Mia Jensen',30,1050,14300),
  mk('u23','tom_magic','Tom Reed',19,670,7200),
  mk('u24','sky_paints','Skylar White',31,520,6400),
  mk('u25','dani_vlogs','Dani Cruz',21,1400,21000),
  mk('u26','ava_skates','Ava Petrova',32,600,7800),
  mk('u27','finn_photo','Finn O\'Brien',22,470,5200),
  mk('u28','ruby_dance','Ruby A.',34,1600,20300),
  mk('u29','max_cook','Max Huang',23,730,8600),
  mk('u30','nora_reads','Nora Kim',35,410,4800),
  mk('u31','jake_lifts','Jake Morrison',36,880,10500),
  mk('u32','zara_style','Zara Ali',37,690,7900),
  mk('u33','ben_drums','Ben Carter',38,1150,13800),
  mk('u34','chloe_diy','Chloe Martin',39,350,4100),
  mk('u35','diego_ball','Diego Reyes',40,1020,12700),
];

/* Each entry has a paired image + caption that match each other */
const FEED = [
  { img: 1105666, cap: '🎵 Live concert vibes — feel the energy! 🔥' },
  { img: 1916821, cap: '💃 New choreo just dropped — 3 days of work!' },
  { img: 3062541, cap: '🎨 Studio session — new piece coming soon' },
  { img: 2078071, cap: '😂 When your friend says "just one more take"' },
  { img: 1640777, cap: '🍳 Fresh plate, fresh day — recipe in bio!' },
  { img: 2247179, cap: '💪 Sunset run — no excuses, just results' },
  { img: 2747449, cap: '✈️ Lost in the streets of Kyoto 🇯🇵' },
  { img: 2773977, cap: '🎮 Gaming setup finally complete! Rate 1-10' },
  { img: 2263436, cap: '👗 Outfit check — all thrifted under $25 ✨' },
  { img: 1108099, cap: '🐾 Morning walk with my best friend 🐕' },
  { img: 3621344, cap: '🔨 Built this from scratch — zero budget!' },
  { img: 1552242, cap: '⚽ This trick shot took 47 attempts…' },
  { img: 3184418, cap: '🎧 Team brainstorm turned jam session' },
  { img: 1239291, cap: '📸 Golden hour portrait — one take ✨' },
  { img: 3861969, cap: '💻 Coding at 3 AM — the app is almost done' },
  { img: 2379004, cap: '🧁 Baking experiment gone right!' },
  { img: 1681010, cap: '🏄 Ocean therapy — nothing beats this view' },
  { img: 2709388, cap: '🧘 Morning yoga on the rooftop' },
  { img: 1222271, cap: '🎭 The face when improv goes right 😂' },
  { img: 3760263, cap: '🌱 Plant haul #47 — yes I have a problem' },
  { img: 3756766, cap: '⚽ Free kick practice — getting closer!' },
  { img: 3184465, cap: '🎤 Harmonizing with the squad 🎶' },
  { img: 2422294, cap: '🪄 Wait for it… magic in 3, 2, 1' },
  { img: 1181671, cap: '🖌️ Digital art process — swipe for final!' },
  { img: 1595385, cap: '📹 Day in the life — creator edition' },
  { img: 2880507, cap: '⛸️ Ice rink all to myself at sunrise' },
  { img: 2662116, cap: '🌄 Chasing sunsets is my full-time job' },
  { img: 1547813, cap: '💫 Late night practice hits different' },
  { img: 2280551, cap: '🔥 Kitchen heat — wok hei mastery' },
  { img: 1907785, cap: '📚 Current reads — top 3 recommendations' },
  { img: 1552252, cap: '🏋️ New PR! Two years in the making 💪' },
  { img: 2220316, cap: '✨ Street style — all vintage finds' },
  { img: 2228561, cap: '🥁 Drum solo I wrote in high school' },
  { img: 3807517, cap: '🪡 Upcycled this old jacket — so happy!' },
  { img: 1752757, cap: '🏀 Full court shot at the buzzer!' },
];

const imgUrl = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&w=800&h=1400&fit=crop`;

/* Google's public sample videos — guaranteed accessible, no auth needed */
const VIDS = [
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  'https://storage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
];

const DEMO: Entry[] = U.map((user, i) => {
  const d = FEED[i % FEED.length];
  return {
    id: `demo-${i}`,
    challengeId: 'demo-c',
    userId: user.id,
    videoUrl: VIDS[i % VIDS.length],
    thumbnailUrl: imgUrl(d.img),
    caption: d.cap,
    duration: 15 + (i % 45),
    voteCount: 200 + ((i * 137) % 4800),
    reactionCounts: { fire:0, heart:0, party:0, clap:0, sparkle:0, love:0 },
    status: 'live', moderationScore: 0.95, rejectionReason: null,
    createdAt: new Date(Date.now() - i * 3600000).toISOString(),
    rank: null, user,
  };
});

/* Only one video player at a time — mounts for active cell, unmounts for others */
const ActiveVideo = ({ uri }: { uri: string }) => {
  const player = useVideoPlayer(uri, p => {
    p.loop = true;
  });

  useEffect(() => {
    try { player.play(); } catch (_) { /* ignore */ }
  }, [player]);

  return (
    <VideoView
      player={player}
      style={StyleSheet.absoluteFill}
      contentFit="cover"
      nativeControls={false}
    />
  );
};

/* ── component ───────────────────────────────────────────────────────────── */
export const HomeScreen = () => {
  const { data: challengeData } = useActiveChallenge();
  const challengeId = challengeData?.id ?? '';
  const { fetchNextPage, hasNextPage, isFetchingNextPage, refetch, isRefetching } = useFeed(challengeId);

  const dbEntries = useFeedStore(s => s.entries);
  const setCurrentIndex = useFeedStore(s => s.setCurrentIndex);
  const vote = useFeedStore(s => s.vote);
  const votedEntryIds = useFeedStore(s => s.votedEntryIds);
  const entries = dbEntries.length > 0 ? dbEntries : DEMO;

  const [activeIndex, setActiveIndex] = useState(0);
  const [commentId, setCommentId] = useState<string | null>(null);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  const tabH = useBottomTabBarHeight();
  const ITEM_H = SH - tabH;

  const vc = useMemo(() => ({ itemVisiblePercentThreshold: 60 }), []);

  const onView = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setActiveIndex(viewableItems[0].index);
        setCurrentIndex(viewableItems[0].index);
      }
    }, [setCurrentIndex]);

  const like = useCallback((id: string) => {
    if (id.startsWith('demo-')) {
      setLikedIds(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
    } else { vote(id); }
  }, [vote]);

  const share = useCallback(() => {
    Share.share({ message: 'Check out this Vybe! 🔥 #Vybe' }).catch(() => {});
  }, []);

  const layout = useCallback((_: unknown, i: number) => ({
    length: ITEM_H, offset: ITEM_H * i, index: i,
  }), [ITEM_H]);

  const renderItem = useCallback(({ item, index }: { item: Entry; index: number }) => {
    const liked = item.id.startsWith('demo-') ? likedIds.has(item.id) : votedEntryIds.has(item.id);
    const isActive = activeIndex === index;
    return (
      <View style={[styles.cell, { height: ITEM_H }]}>
        <Image
          source={{ uri: item.thumbnailUrl || item.videoUrl }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
        {/* Video plays only on the active cell */}
        {isActive && <ActiveVideo uri={item.videoUrl} />}
        {/* Content overlay */}
        <View style={styles.overlay}>
          <View style={styles.info}>
            <View style={styles.userRow}>
              <Image source={{ uri: item.user?.avatarUrl }} style={styles.avatar} />
              <Text style={styles.uname}>@{item.user?.username ?? 'unknown'}</Text>
            </View>
            <Text style={styles.cap} numberOfLines={2}>{item.caption}</Text>
          </View>
          <View style={styles.bar}>
            <TouchableOpacity style={styles.act} onPress={() => like(item.id)} activeOpacity={0.7}>
              <Heart color={liked ? '#FF4B6E' : '#fff'} fill={liked ? '#FF4B6E' : 'transparent'} size={30} />
              <Text style={styles.cnt}>{(item.voteCount + (liked ? 1 : 0)).toLocaleString()}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.act} onPress={() => setCommentId(item.id)} activeOpacity={0.7}>
              <MessageCircle color="#fff" size={30} />
              <Text style={styles.cnt}>{42 + (item.voteCount % 180)}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.act} onPress={share} activeOpacity={0.7}>
              <Share2 color="#fff" size={28} />
              <Text style={styles.cnt}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }, [ITEM_H, activeIndex, likedIds, votedEntryIds, like, share]);

  return (
    <View style={styles.root}>
      <View style={styles.topBar}>
        <Pill label={challengeData ? `🔥 ${challengeData.title}` : '🔥 Trending'} variant="primary" />
      </View>
      <FlatList
        data={entries} keyExtractor={i => i.id} renderItem={renderItem}
        pagingEnabled showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_H} snapToAlignment="start" decelerationRate="fast"
        getItemLayout={layout} onViewableItemsChanged={onView} viewabilityConfig={vc}
        refreshControl={
          <RefreshControl refreshing={isRefetching}
            onRefresh={() => { useFeedStore.setState({ nextCursor: undefined, currentIndex: 0 }); refetch(); }}
            tintColor={colors.primary.base} />
        }
        onEndReached={() => { if (hasNextPage && !isFetchingNextPage) fetchNextPage(); }}
        onEndReachedThreshold={0.5}
        initialNumToRender={2} maxToRenderPerBatch={3} windowSize={5}
        removeClippedSubviews={Platform.OS === 'android'}
        ListFooterComponent={isFetchingNextPage
          ? <View style={styles.foot}><ActivityIndicator color={colors.primary.base} /></View>
          : null}
      />
      <CommentSheet entryId={commentId} onClose={() => setCommentId(null)} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  cell: { width: SW, backgroundColor: '#000' },
  overlay: {
    ...StyleSheet.absoluteFillObject, flexDirection: 'row',
    alignItems: 'flex-end', paddingHorizontal: spacing.md, paddingBottom: spacing.xl,
  },
  info: { flex: 1, paddingRight: spacing.md },
  userRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs },
  avatar: {
    width: 40, height: 40, borderRadius: 20, borderWidth: 2,
    borderColor: colors.primary.base, marginRight: spacing.sm, backgroundColor: '#333',
  },
  uname: {
    color: '#fff', ...typography.weights.bold, fontSize: typography.sizes.md,
    textShadowColor: 'rgba(0,0,0,0.9)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 6,
  },
  cap: {
    color: '#fff', ...typography.weights.regular, fontSize: typography.sizes.sm, lineHeight: 20,
    textShadowColor: 'rgba(0,0,0,0.9)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 6,
  },
  bar: { alignItems: 'center', gap: 22, paddingBottom: 8 },
  act: { alignItems: 'center', gap: 4 },
  cnt: {
    color: '#fff', ...typography.weights.semiBold, fontSize: 12,
    textShadowColor: 'rgba(0,0,0,0.9)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 6,
  },
  topBar: { position: 'absolute', top: 60, left: 0, right: 0, zIndex: 10, alignItems: 'center' },
  foot: { height: 100, justifyContent: 'center', alignItems: 'center' },
});
