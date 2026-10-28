import type { TreeNodeData } from "@mantine/core";
import { getItemByValue } from ".";
import type { Data, IDECommandContext, TransformReturnType } from "./type";

const pwd = (ctx: IDECommandContext) => {
  ctx.store.emit(ctx.id, {
    changes: { [Date.now()]: ctx.currentPath },
    end: true,
  });
};

const ll = (ctx: IDECommandContext) => {
  ctx.store.emit(ctx.id, {
    changes: {
      [Date.now()]:
        "<br /><label style='padding-left: 40px'>Directory: ${ctx.currentPath}</label>",
    },
  });
  let tree: TreeNodeData[] | Data[] = [];
  if (ctx.currentPath === "root") {
    tree = ctx.tree;
  } else {
    tree = getItemByValue(ctx.currentPath, ctx.tree)?.children ?? [];
  }
  ctx.store.emit(ctx.id, {
    [Date.now()]: tree.reduce(
      (acc, curr, index) =>
        acc + `  ${curr.label}` + (index === ctx.tree.length - 1)
          ? "</label><br/>"
          : "",
      "<br/><label>",
    ),
  });
};

const cd = (ctx: IDECommandContext, to: string) => {
  const tree = getItemByValue(ctx.currentPath, ctx.tree);
  if (!tree?.children?.some((child) => child.label === to)) {
    ctx.store.emit(ctx.id, {
      [Date.now()]: `<error>Cannot find path '${ctx.currentPath}/${to}' because it does not exist</error>`,
      end: true,
    });
    return;
  }
  ctx.setCurrentPath(`${ctx.currentPath}/${to}`);
  ctx.store.emit(ctx.id, { end: true });
  return;
};

const open = (ctx: IDECommandContext, file: string) => {
  const filePath = `${ctx.currentPath}/${file}`;
  const item = getItemByValue(filePath, ctx.tree);
  if (!item) {
    ctx.store.emit(ctx.id, {
      [Date.now()]: `<error>Cannot open file '${file}' because it does not exist</error>`,
      end: true,
    });
    return;
  }
  ctx.openFile(filePath);
  ctx.store.emit(ctx.id, { end: true });
};

const cat = (ctx: IDECommandContext, file: string) => {
  const filePath = `${ctx.currentPath}/${file}`;
  const item = getItemByValue(filePath, ctx.tree);
  if (!item) {
    ctx.store.emit(ctx.id, {
      [Date.now()]: `<error>Cannot view file '${file}' because it does not exist</error>`,
      end: true,
    });
    return;
  }
  ctx.store.emit(ctx.id, { [Date.now()]: ctx.viewFile(filePath) });
  ctx.store.emit(ctx.id, { end: true });
};

const transform = (input: string): TransformReturnType => {
  const splitted = input.trim().replace(/\s+/g, " ").split(" ");
  if (splitted.length === 0) throw new Error("invalid command");
  return { fn: splitted.at(0)!, params: splitted.slice(-1) };
};

const FnMapping = {
  pwd: pwd,
  ll: ll,
  cat: cat,
  cd: cd,
  open: open,
};

export { FnMapping, transform };
