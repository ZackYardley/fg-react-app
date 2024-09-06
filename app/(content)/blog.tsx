import { View, ScrollView, StyleSheet, ImageSourcePropType } from "react-native";
import { StatusBar } from "expo-status-bar";
import { BackButton, PageHeader, ThemedSafeAreaView, ThemedView, ThemedText } from "@/components/common";
import { Href, Link } from "expo-router";
import { Image } from "expo-image";

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
  return (
    <ThemedSafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
        <PageHeader subtitle="Blogs" />
        <BackButton />
        <View>
          {POSTS.map((item: DataType, index: string) => (
            <Link key={index} href={item.href as Href}>
              <Image source={item.featuredImage} style={styles.featuredImage} />
              <ThemedView style={styles.postContainer}>
                <Image source={item.featuredImage} style={styles.featuredImage} />
                <ThemedText style={styles.postTitle}>{item.title}</ThemedText>
                <ThemedText style={styles.postDate}>{item.value}</ThemedText>
                <ThemedText style={styles.postDescription}>{item.description}</ThemedText>
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
  postContainer: {
    borderRadius: 20,
    padding: 20,
  },
  postTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  postDate: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  postDescription: {
    fontSize: 16,
    color: "#333",
  },
  featuredImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    marginBottom: 10,
    borderRadius: 8,
  },
});
