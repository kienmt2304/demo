import useInfiniteImages from "~/hooks/useImage";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useRef } from "react";
import {
  Alert,
  AspectRatio,
  Box,
  Center,
  Image,
  Loader,
  Paper,
  ScrollArea,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
} from "@mantine/core";
import { useElementSize } from "@mantine/hooks";

export default function InfiniteScroll() {
  const {
    data,
    status,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteImages();

  const viewportRef = useRef(null);
  const { ref: sizeRef, width: containerWidth } = useElementSize();

  const gap = (12 * containerWidth) / 1600;
  const imageHeight = (containerWidth - gap * 4) / 5;
  const rowHeight = imageHeight + gap;

  const allRows = data ? data.pages.flatMap((page) => page.items) : [];

  const rowCount = Math.ceil(allRows.length / 5);

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? allRows.length + 1 : allRows.length,
    getScrollElement: () => viewportRef.current,
    estimateSize: () => rowHeight,
    overscan: 5,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  useEffect(() => {
    const lastItem = virtualItems.at(-1);
    if (!lastItem) return;

    if (lastItem.index >= rowCount - 1 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [virtualItems, rowCount, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    rowVirtualizer.measure();
  }, [rowHeight, rowVirtualizer]);

  let content;

  if (status === "pending") {
    content = (
      <SimpleGrid cols={5} spacing={gap} verticalSpacing={gap}>
        {Array.from({ length: 15 }).map((_, i) => (
          <AspectRatio key={i} ratio={1}>
            <Skeleton radius="sm" />
          </AspectRatio>
        ))}
      </SimpleGrid>
    );
  } else if (status === "error") {
    content = (
      <Alert color="red" title="Could't load items">
        {error.message}
      </Alert>
    );
  } else
    content = (
      <Paper radius="md" p={gap}>
        <Box ref={sizeRef}>
          <ScrollArea h={950} viewportRef={viewportRef} type="auto">
            <div
              style={{
                height: rowVirtualizer.getTotalSize(),
                width: "100%",
                position: "relative",
              }}
            >
              {virtualItems.map((virtualRow) => {
                const isLoaderRow = virtualRow.index >= rowCount;
                const start = virtualRow.index * 5;
                const rowImages = allRows.slice(start, start + 5);

                return (
                  <div
                    key={virtualRow.key}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: rowHeight,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    {isLoaderRow ? (
                      <Center>
                        {hasNextPage ? (
                          <Loader size="sm" />
                        ) : (
                          <Text size="sm" c="dimmed">
                            No more images
                          </Text>
                        )}
                      </Center>
                    ) : (
                      <SimpleGrid cols={5} spacing={gap}>
                        {rowImages.map((img) => (
                          <Image
                            key={img.id}
                            src={img.url}
                            alt={img.title}
                            fit="cover"
                            radius="sm"
                            loading="lazy"
                          />
                        ))}
                      </SimpleGrid>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </Box>
      </Paper>
    );
  return content;
}
