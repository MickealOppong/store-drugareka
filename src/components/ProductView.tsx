import { useState } from "react";
import { FiEdit2, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import { Link, useSearchParams } from "react-router-dom";

import "../css/GenericViewLayout.css"; // Universal layout style mapping sheet
import { useGetStorelistingsQuery } from "../features/api/itemApi";
import { useDeleteBrandMutation } from "../features/api/transApi";
import { useAppSelector } from "../store";
import type { TListTrans } from "../types/TListTrans";
import { isFetchBaseQueryError } from "../util/util";
import Pagination from "./Pagination";

const ProductView = () => {
  const [searchParams,] = useSearchParams();
  
  // Read active pagination location straight from URL parameters (1-indexed base)
  const page = parseInt(searchParams.get("page" )as string)||1;

  //delete mutation hook
    const [deleteListing] = useDeleteBrandMutation()
  // Spring Boot JPA is 0-indexed, so we subtract 1 on our outgoing backend cache query

  const { data, isLoading: productsLoading, error } = useGetStorelistingsQuery({
    page, 
    size:5
  });


  const productListings = data?.listings as TListTrans[];
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);



  
  /**
   * ROLE AUTH CHECK
   */
  const roles = useAppSelector((state) => state.userSlice.roles);

  /*
   * Delete Handler Action
   */
  const handleDelete = async (listing:number) => {
    const confirmed = window.confirm(
      `Do you want to delete listing "${listing}"?`,
    );

    if (!confirmed) {
      return;
    }
    try {
      await deleteListing(listing)
      setDeletingId(listing)
    } catch (error) {
      
    }
  };



  if (!productListings) {
    return null;
  }

  /*
   * Filter computation engine
   */
  const filteredList = productListings.filter((product) =>
    product.productName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="panel-view">
      {/* =====================================================
                GENERIC HEADER BLOCK
            ====================================================== */}
      <header className="panel-view__header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span className="panel-view__eyebrow">Catelog</span>
          <h1 className="panel-view__title">All Products</h1>
          <p className="panel-view__description">Manage products.</p>
        </div>

        {/* Dynamic add link using your standard Sage Green styling elements */}
        {!roles.includes("ROLE_ADMIN") && (
          <Link
            to="/account/listings/new"
            className="data-table__action-link"
            style={{ display: "flex", gap: "0.5rem", padding: "0 1rem", width: "auto", minWidth: "130px", height: "40px", backgroundColor: "#66704A", color: "#ffffff", borderColor: "#66704A", borderRadius: "12px", textDecoration: "none", fontWeight: 600, fontSize: "14px" }}
          >
            <FiPlus />
           Add produkt
          </Link>
        )}
      </header>

      {/* =====================================================
                GENERIC TOOLBAR GRID
            ====================================================== */}
      <div className="panel-view__toolbar">
        <div className="panel-view__search-wrapper">
          <FiSearch />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="panel-view__metrics-counter">
          {filteredList.length}{" "}
          {filteredList.length === 1 ? "product" : "products"}
        </div>
      </div>

      {/* =====================================================
                GENERIC ERROR MESSAGE ROW
            ====================================================== */}
      {error && (
        <div className="panel-view__error-box">
          {isFetchBaseQueryError(error)}
        </div>
      )}

      {/* =====================================================
                GENERIC TABLE CONTAINER CARD
            ====================================================== */}
      <section className="panel-view__content-card">
        {productsLoading ? (
          <div className="panel-view__loading-overlay">loading products...</div>
        ) : filteredList.length === 0 ? (
          <div className="panel-view__empty-state">
            <div className="panel-view__empty-title">No products</div>
            <p>
              {search
                ? "Nie znaleziono produktów pasujących do wyszukiwania."
                : "Nie utworzono jeszcze żadnych produktów."}
            </p>
          </div>
        ) : (
          <div className="panel-view__scroll-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Nr</th>
                  <th>Description</th>
                  {roles.includes("ROLE_ADMIN") && <th>Seller</th>}
                  <th>Slug</th>
                  <th>Brand</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Product Status</th>
                  <th>Listing Status</th>
                  <th className="data-table__actions-header">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredList.map((product) => (
                  <tr key={product.listingId}>
                    {/* AVATAR + PRODUCT TITLE */}
                    <td>
                      <div className="data-table__user-profile">
                        <span className="data-table__avatar-badge">
                          {product.productName?.charAt(0)?.toUpperCase()}
                        </span>
                        <span className="font-semibold text-main">{product.productName}</span>
                      </div>
                    </td>

                    {/* PRODUCT ID INDEX */}
                    <td>
                      <span className="data-table__text text-muted">
                        #{product.listingId}
                      </span>
                    </td>

                    {/* SUBSTRING SUMMARY DESCRIPTION DESCRIPTOR */}
                    <td>
                      <span className="data-table__text text-muted" title={product.productDescription}>
                        {product.productDescription ? `${product.productDescription.substring(0, 30)}...` : ''}
                      </span>
                    </td>

                    {/* ADMIN PRIVILEGED SELLER ROW LINK */}
                    {roles.includes("ROLE_ADMIN") && (
                      <td>
                        <span className="data-table__text text-muted">
                          {product.sellerId}
                        </span>
                      </td>
                    )}

                    {/* SLUG ROW */}
                    <td>
                      <span className="data-table__text text-muted">
                        {product.productSlug}
                      </span>
                    </td>

                    {/* BRAND COLUMN */}
                    <td>
                      <span className="data-table__text font-semibold">
                        {product.brand}
                      </span>
                    </td>

                    {/* CATEGORY DECORATOR */}
                    <td>
                      <span className="data-table__text">
                        {product.category}
                      </span>
                    </td>

                    {/* PRICE VIEW FOR VALUE MARGIN MARKUPS */}
                    <td>
                      <span className="data-table__text font-bold text-primary">
                        {product.priceDto.sellerNewPrice}
                      </span>
                    </td>

                    {/* INVENTORY ITEM RESERVATION STATUS BADGES */}
                    <td>
                      <span className={`status-badge status-badge--${product.inventoryStatus?.toLowerCase().replace(/_/g, "-")}`}>
                        {product.inventoryStatus?.replace(/_/g, " ")}
                      </span>
                    </td>

                    {/* STOREFRONT EXPOSURE LISTING STATUS BADGES */}
                    <td>
                      <span className={`status-badge status-badge--${product.listingStatus?.toLowerCase().replace(/_/g, "-")}`}>
                        {product.listingStatus?.replace(/_/g, " ")}
                      </span>
                    </td>

                    {/* ACCOUNT SELECTION MANAGEMENT INTERACTIONS */}
                    <td>
                      <div className="data-table__actions" style={{ gap: "0.5rem" }}>
                        <Link
                          to={`/account/listings/${product.productId}/edit`}
                          className="data-table__action-link"
                          title="Edytuj"
                        >
                          <FiEdit2 />
                        </Link>

                        <button
                          type="button"
                          className="data-table__action-link"
                          style={{ color: "#e11d48" }}
                          title="Usuń"
                          disabled={deletingId === product.listingId}
                          onClick={() => handleDelete(product.listingId)}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
     {
      data &&  <Pagination page={page} totalPage={data?.totalPages}
       size={data?.pageSize}    totalElements={data?.totalElements}/>
     }
      </main> 
  )     

}
export default ProductView;
