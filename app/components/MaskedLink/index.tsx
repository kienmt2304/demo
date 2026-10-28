import { Link, useLocation, type LinkProps } from "react-router";
import { MODAL_STATE } from "~/const";
import stripSlash from "~/utils/stripSlash";

type MaskedLinkProps = Omit<LinkProps, "to"> & {
  mask: string;
};

export default function MaskedLink({ mask, ...props }: MaskedLinkProps) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  params.set("modal", stripSlash(mask));

  return (
    <Link
      {...props}
      to={`${location.pathname}?${params}`}
      mask={`/${stripSlash(mask)}`}
      state={MODAL_STATE}
    ></Link>
  );
}
