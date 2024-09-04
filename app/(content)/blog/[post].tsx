import { MDXStyles } from "@bacons/mdx";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMemo } from "react";
import { ScrollView, View, Text, StyleSheet, useWindowDimensions, Platform, Dimensions } from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackButton, PageHeader } from "@/components/common";

export async function generateStaticParams(): Promise<{ post: string }[]> {
  return mdxctx
    .keys()
    .filter((i: string) => i.match(/\.js$/))
    .map((key: any) => mdxctx(key).slug)
    .map((post: any) => ({ post }));
}

const mdxctx = (require as any).context("../../../assets/blog", true, /\.(mdx|js)$/);

type PostInfo = {
  tags: string[];
  date: string;
  title: string;
  subtitle: string;
  slug: string;
  featuredImage: string;
};

const useData = (postId: string) => {
  const MDKey = useMemo(() => mdxctx.keys().find((p: string) => p === "./" + postId + "/index.mdx"), [postId]);

  const mdinfo = useMemo(() => mdxctx.keys().find((p: string) => p === "./" + postId + "/index.js"), [postId]);

  const MD = MDKey ? mdxctx(MDKey).default : null;
  const Info: PostInfo = mdinfo ? mdxctx(mdinfo) : null;

  if (!MD || !Info) {
    return null;
  }
  return { MarkdownComponent: MD, info: Info };
};

export default function BlogPostPage() {
  const { post: postId } = useLocalSearchParams<{ post: string }>();
  const data = useData(postId);

  const screenWidth = Dimensions.get("window").width;

  if (!data) {
    return <Text style={styles.errorText}>Not Found: {postId}</Text>;
  }

  const { MarkdownComponent, info } = data;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollViewContent} contentInsetAdjustmentBehavior="automatic">
        <PageHeader subtitle="Blogs" />
        <BackButton />
        <View style={styles.header}>
          <Text style={styles.title}>{info.title}</Text>
          <Text style={styles.subtitle}>{info.subtitle}</Text>
          <Text style={styles.date}>{new Date(info.date).toLocaleDateString()}</Text>
          {info.tags.map((tag, index) => (
            <Text key={index} style={styles.tag}>
              #{tag}
            </Text>
          ))}
        </View>
        <MDXStyles
          img={{
            borderRadius: 16,
            marginBottom: 20,
            height: 300,
            width: screenWidth - 40,
          }}
        >
          <MarkdownComponent />
        </MDXStyles>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },

  header: {
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: "#999",
    marginBottom: 8,
  },
  tag: {
    fontSize: 14,
    color: "#007AFF",
    marginBottom: 8,
  },
  featuredImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});
