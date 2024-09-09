import { View, ScrollView, StyleSheet, ImageSourcePropType, Dimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import { BackButton, PageHeader, ThemedSafeAreaView, ThemedView, ThemedText } from "@/components/common";
import { Href, Link } from "expo-router";
import { Image } from "expo-image";
import { darkenColor } from "@/utils";
import { useThemeColor } from "@/hooks";

type DataType = {
  title: string;
  description: string;
  value: string;
  href: string;
  featuredImage: ImageSourcePropType;
};

const mdxctx = (require as any).context("../../assets/blog", true, /\.(mdx|js)$/);

const posts = mdxctx
  .keys()
  .filter((i: string) => i.match(/\.js$/))
  .map((key: any) => mdxctx(key));

const POSTS = posts
  .map(
    ({
      title,
      shortTitle,
      subtitle,
      date,
      slug,
      featuredImage,
    }: {
      title: string;
      shortTitle: string;
      subtitle: string;
      date: Date;
      slug: string;
      featuredImage: ImageSourcePropType;
    }) => ({
      title: shortTitle ?? title,
      description: subtitle,
      value: new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      date,
      href: `/blog/${slug}`,
      featuredImage,
    })
  )
  .sort((a: { date: string }, b: { date: string }) => b.date.localeCompare(a.date));

export default function ForevergreenBlogsPage() {
  const width = Dimensions.get("window").width;
  const textColor = useThemeColor({}, "text");

  return (
    <ThemedSafeAreaView style={styles.container}>
      <StatusBar />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <PageHeader subtitle="Blogs" />
        <BackButton />
        <ThemedView style={styles.infoBox}>
          <ThemedText type="subtitle" style={styles.infoTitle}>
            Learn more by reading some blogs!
          </ThemedText>
          <ThemedText>
            Whether you are an avid environmentalist or someone just wanting to learn more we hope you can learn
            something new and exciting from one of our many blogs.
          </ThemedText>
        </ThemedView>
        <View>
          {POSTS.map((item: DataType, index: string) => (
            <Link key={index} href={item.href as Href}>
              <ThemedView style={[styles.postContainer, { width: width - 40 }]}>
                <Image source={item.featuredImage} style={styles.featuredImage} contentFit="cover" />
                <View style={styles.postDetails}>
                  <ThemedText style={styles.postTitle}>{item.title}</ThemedText>
                  <ThemedText style={[styles.postDate, { color: darkenColor(textColor, 20) }]}>{item.value}</ThemedText>
                  <ThemedText style={[styles.postDescription, { color: darkenColor(textColor, 40) }]}>
                    {item.description}
                  </ThemedText>
                </View>
              </ThemedView>
            </Link>
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
    paddingHorizontal: 20,
  },
  infoBox: {
    borderRadius: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  infoTitle: {
    marginBottom: 12,
  },
  postContainer: {
    borderRadius: 20,
    marginBottom: 20,
    flexDirection: "row",
  },
  featuredImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
  },
  postDetails: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
  },
  postTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  postDate: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 5,
  },
  postDescription: {
    fontSize: 16,
    textAlign: "center",
  },
});
