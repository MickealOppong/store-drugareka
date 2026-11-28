import type { Store } from "redux";
import { DesktopLanding, MobileLanding } from "../components/index";
import '../css/Landing.css';
import { storeApi } from "../features/api/storeApi";
import { type AppDispatch, type RootState } from "../store";

import { replace, type LoaderFunctionArgs } from "react-router";

export const loader = (store: Store<RootState>) =>
  async ({ request }: LoaderFunctionArgs) => {

    const url = new URL(request.url);
    const params = url.searchParams;

    let changed = false;

    if (!params.has("category")) {
      params.set("category", "all_0");
      changed = true;
    }

    if (!params.has("page")) {
      params.set("page", "1");
      changed = true;
    }

    if (changed) {
      return replace(`${url.pathname}?${params.toString()}`);
    }

    const dispatch = store.dispatch as AppDispatch;

    const topCategories = await dispatch(
      storeApi.endpoints.getTop6ProductCategories.initiate()
    );

    return topCategories.data || [];
  };


const Landing = () => {
  return (
    <>
      <div className="landing-desktop">
        <DesktopLanding />
      </div>

      <div className="landing-mobile">
        <MobileLanding />
      </div>
    </>
  );
};
export default Landing