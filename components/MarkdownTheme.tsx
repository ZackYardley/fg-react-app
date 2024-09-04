import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MDXComponents, MDXStyles, resolveAssetUrl } from "@bacons/mdx";
import { BlockQuote } from "@expo/html-elements";
import { Link } from "expo-router";
import { Image } from "expo-image";

export function MarkdownTheme({ children }: { children: React.ReactNode }) {
  return (
    <MDXStyles
      h1={{
        fontSize: 24,
        fontWeight: "bold",
        color: "#000000",
        marginBottom: 16,
      }}
      h2={{
        fontSize: 20,
        fontWeight: "bold",
        color: "#000000",
        marginTop: 24,
        marginBottom: 16,
      }}
      h3={{
        fontSize: 18,
        fontWeight: "bold",
        color: "#000000",
        marginTop: 20,
        marginBottom: 12,
      }}
      p={{
        fontSize: 16,
        lineHeight: 24,
        color: "#000000",
        marginBottom: 16,
      }}
      strong={{
        fontWeight: "bold",
        color: "#000000",
      }}
      em={{
        fontStyle: "italic",
      }}
      ul={{
        marginBottom: 16,
        paddingLeft: 20,
      }}
      ol={{
        marginBottom: 16,
        paddingLeft: 20,
      }}
      li={{
        fontSize: 16,
        lineHeight: 24,
        color: "#000000",
        marginBottom: 8,
      }}
      a={styles.link}
      img={{
        marginBottom: 20,
        borderRadius: 16,
        minHeight: 180,
        maxHeight: 480,
      }}
    >
      <MDXComponents
        pre={({ style, children }) => <View style={[styles.codeBlock, style]}>{children}</View>}
        code={({ children }) => <Text style={styles.code}>{children}</Text>}
        p={({ style, children }) => <Text style={[styles.paragraph, style]}>{children}</Text>}
        blockquote={({ style, children }) => <BlockQuote style={[styles.blockquote, style]}>{children}</BlockQuote>}
        a={({ href, style, children }) => (
          <Link href={href} style={[styles.link, style]}>
            {children}
          </Link>
        )}
        li={({ style, children }) => (
          <View style={styles.listItem}>
            <View style={styles.listItemBullet} />
            <Text style={[styles.listItemText, style]}>{children}</Text>
          </View>
        )}
        img={Img}
      >
        {children}
      </MDXComponents>
    </MDXStyles>
  );
}

function Img({ src, style }: { src: string; style: any }) {
  const source = typeof src === "string" ? { uri: src } : src;
  const srcUrl = resolveAssetUrl(source);

  // if (srcUrl && srcUrl.match(/\.mp4$/)) {
  //   return (
  //     <video
  //       src={srcUrl ? srcUrl : undefined}
  //       style={{ ...style, height: "auto", width: "100%", overflow: "hidden", objectFit: "contain" }}
  //       controls
  //       autoPlay
  //       loop
  //       playsInline
  //     />
  //   );
  // }
  return (
    <Image
      source={srcUrl ? srcUrl : undefined}
      style={{ ...style, height: "auto", maxWidth: "100%", overflow: "hidden", objectFit: "contain" }}
    />
  );
}

const styles = StyleSheet.create({
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: "#000000",
    marginBottom: 16,
  },
  link: {
    color: "#4A90E2",
    textDecorationLine: "underline",
  },
  codeBlock: {
    backgroundColor: "#F5F5F5",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  code: {
    fontFamily: "monospace",
    fontSize: 14,
  },
  blockquote: {
    borderLeftWidth: 4,
    borderLeftColor: "#4A90E2",
    paddingLeft: 16,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 16,
    marginBottom: 16,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  listItemBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#000000",
    marginTop: 8,
    marginRight: 8,
  },
  listItemText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: "#000000",
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 8,
    marginBottom: 16,
  },
});
