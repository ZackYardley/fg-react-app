import { MDXStyles } from "@bacons/mdx";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMemo } from "react";
import { ScrollView, View, Text, StyleSheet, Dimensions } from "react-native";
import {
  BackButton,
  GreenCircles,
  NotFoundComponent,
  PageHeader,
  ThemedSafeAreaView,
  ThemedText,
  ThemedView,
} from "@/components/common";
import { useThemeColor } from "@/hooks";
import { Image } from "expo-image";
import { Credit } from "@/constants/Images";
import dayjs from "dayjs";

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
  author: string;
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
  const textColor = useThemeColor({}, "text");
  const { post: postId } = useLocalSearchParams<{ post: string }>();
  const data = useData(postId);

  const screenWidth = Dimensions.get("window").width;

  if (!data) {
    return <NotFoundComponent />;
  }

  const { MarkdownComponent, info } = data;

  return (
    <ThemedSafeAreaView style={styles.container}>
      <StatusBar />
      <ScrollView contentContainerStyle={styles.scrollViewContent} contentInsetAdjustmentBehavior="automatic">
        <PageHeader subtitle="Blogs" />
        <BackButton />
        <GreenCircles />
        <View style={styles.header}>
          <ThemedText style={styles.title}>{info.title}</ThemedText>
          <View style={{ display: "flex", flexDirection: "row", gap: 8, alignItems: "center" }}>
            <Image source={Credit} style={styles.authorImage} />
            <ThemedText style={styles.subtitle}>{info.author}</ThemedText>
          </View>
          {/* <Image source={info.featuredImage} style={styles.featuredImage} contentFit="cover" /> */}
          <ThemedText style={styles.date}>{dayjs(info.date).format("MMM DD, YYYY")}</ThemedText>
        </View>
        <MDXStyles
          img={{
            borderRadius: 16,
            marginBottom: 20,
            height: 300,
            width: screenWidth - 40,
          }}
          h1={{
            color: textColor,
            marginVertical: 10,
            fontWeight: "600",
            paddingBottom: 5,
            fontSize: 32,
            borderBottomColor: textColor,
            borderBottomWidth: 1,
          }}
          h2={{
            color: textColor,
            marginVertical: 10,
            fontWeight: "600",
            paddingBottom: 5,
            fontSize: 28,
            borderBottomColor: textColor,
            borderBottomWidth: 1,
          }}
          h3={{
            color: textColor,
            marginVertical: 10,
            fontWeight: "600",
            paddingBottom: 5,
            fontSize: 24,
            borderBottomColor: textColor,
            borderBottomWidth: 1,
          }}
          p={{
            color: textColor,
            fontSize: 16,
            lineHeight: 24,
            marginBottom: 10,
          }}
          a={{
            color: "#0969da",
            textDecorationLine: "underline",
          }}
          ul={{
            paddingLeft: 20,
          }}
          ol={{
            paddingLeft: 20,
          }}
          li={{
            color: textColor,
            fontSize: 16,
            lineHeight: 24,
            marginBottom: 5,
          }}
          code={{
            fontFamily: "monospace",
            backgroundColor: "#f6f8fa",
            paddingHorizontal: 5,
            paddingVertical: 2,
            borderRadius: 3,
          }}
          pre={{
            backgroundColor: "#f6f8fa",
            padding: 16,
            borderRadius: 6,
            overflow: "scroll",
          }}
          blockquote={{
            borderLeftWidth: 4,
            borderLeftColor: "#d0d7de",
            paddingLeft: 16,
            fontStyle: "italic",
            marginLeft: 0,
            marginRight: 0,
          }}
          table={{
            borderWidth: 1,
            borderColor: "#d0d7de",
            borderRadius: 6,
            marginBottom: 16,
          }}
          th={{
            backgroundColor: "#f6f8fa",
            padding: 10,
            fontWeight: "600",
          }}
          td={{
            padding: 10,
            borderTopWidth: 1,
            borderTopColor: "#d0d7de",
          }}
        >
          <MarkdownComponent />
        </MDXStyles>
        <ThemedText style={styles.subtitle}>{info.subtitle}</ThemedText>
        <View style={{ display: "flex", flexDirection: "row", gap: 24, justifyContent: "flex-start" }}>
          {info.tags.map((tag, index) => (
            <ThemedView
              key={index}
              style={{
                display: "flex",
                paddingTop: 8,
                paddingHorizontal: 12,
                borderRadius: 36,
                alignContent: "center",
                marginVertical: 8,
              }}
            >
              <ThemedText style={styles.tag}>{tag[0].toUpperCase() + tag.slice(1)}</ThemedText>
            </ThemedView>
          ))}
        </View>
      </ScrollView>
    </ThemedSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    marginBottom: 8,
  },
  tag: {
    fontSize: 14,
    marginBottom: 8,
  },
  authorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 8,
  },
  featuredImage: {
    width: "100%",
    height: 200,
    borderRadius: 16,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});
