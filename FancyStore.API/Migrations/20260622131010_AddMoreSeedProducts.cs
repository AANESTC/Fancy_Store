using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace FancyStore.API.Migrations
{
    /// <inheritdoc />
    public partial class AddMoreSeedProducts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 22, 13, 10, 10, 130, DateTimeKind.Utc).AddTicks(4595));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 22, 13, 10, 10, 130, DateTimeKind.Utc).AddTicks(5751));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 22, 13, 10, 10, 130, DateTimeKind.Utc).AddTicks(5753));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 22, 13, 10, 10, 130, DateTimeKind.Utc).AddTicks(5754));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 22, 13, 10, 10, 130, DateTimeKind.Utc).AddTicks(5755));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 22, 13, 10, 10, 130, DateTimeKind.Utc).AddTicks(5756));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 22, 13, 10, 10, 130, DateTimeKind.Utc).AddTicks(5757));

            migrationBuilder.UpdateData(
                table: "Coupons",
                keyColumn: "CouponId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 22, 13, 10, 10, 131, DateTimeKind.Utc).AddTicks(1113));

            migrationBuilder.UpdateData(
                table: "Coupons",
                keyColumn: "CouponId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 22, 13, 10, 10, 131, DateTimeKind.Utc).AddTicks(3692));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 1,
                column: "Description",
                value: "Premium gold-plated bangles with intricate craftsmanship.");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 2,
                column: "Description",
                value: "Minimalist and modern invisible chain for daily wear.");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 3,
                column: "Description",
                value: "Trending Korean style elegant drop earrings.");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 4,
                column: "Description",
                value: "Thick, luxurious dollar chain design.");

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "ProductId", "CategoryId", "Color", "CreatedAt", "Description", "Discount", "ImageUrl", "IsActive", "IsBestSeller", "IsNewArrival", "IsTrending", "Material", "Name", "Price", "Size", "Stock", "VideoUrl" },
                values: new object[,]
                {
                    { 5, 1, null, new DateTime(2024, 1, 2, 0, 0, 0, 0, DateTimeKind.Utc), "Traditional bangles embedded with premium artificial rubies.", 5m, "https://images.unsplash.com/photo-1629224316810-9d8805b95e76?w=800&auto=format&fit=crop", true, false, false, false, null, "Ruby Studded Bangles", 1599m, null, 20, null },
                    { 6, 4, null, new DateTime(2024, 1, 3, 0, 0, 0, 0, DateTimeKind.Utc), "Stunning hoop earrings with delicate diamond accents.", 10m, "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&auto=format&fit=crop", true, false, false, false, null, "Diamond Accent Hoops", 599m, null, 80, null },
                    { 7, 2, null, new DateTime(2024, 1, 4, 0, 0, 0, 0, DateTimeKind.Utc), "Timeless pearl necklace perfect for evening wear.", 25m, "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&auto=format&fit=crop", true, false, false, false, null, "Classic Pearl Necklace", 1899m, null, 15, null },
                    { 8, 5, null, new DateTime(2024, 1, 5, 0, 0, 0, 0, DateTimeKind.Utc), "Sparkling crystal hair accessories for bridal and party wear.", 0m, "https://images.unsplash.com/photo-1569397288884-4d43e667d264?w=800&auto=format&fit=crop", true, false, false, false, null, "Crystal Hair Pin Set", 349m, null, 150, null },
                    { 9, 1, null, new DateTime(2024, 1, 6, 0, 0, 0, 0, DateTimeKind.Utc), "Modern rose gold cuff with a sleek, minimalist aesthetic.", 20m, "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&auto=format&fit=crop", true, false, false, false, null, "Rose Gold Cuff Bangle", 899m, null, 45, null },
                    { 10, 4, null, new DateTime(2024, 1, 7, 0, 0, 0, 0, DateTimeKind.Utc), "Elegant teardrop earrings featuring deep blue sapphire replicas.", 15m, "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?w=800&auto=format&fit=crop", true, false, false, false, null, "Sapphire Tear Drop Earrings", 649m, null, 60, null },
                    { 11, 2, null, new DateTime(2024, 1, 8, 0, 0, 0, 0, DateTimeKind.Utc), "Fashion-forward multi-layered gold chain.", 30m, "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&auto=format&fit=crop", true, false, false, false, null, "Layered Gold Chain", 1199m, null, 25, null },
                    { 12, 7, null, new DateTime(2024, 1, 9, 0, 0, 0, 0, DateTimeKind.Utc), "Perfect gift item for storing precious jewelry securely.", 0m, "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop", true, false, false, false, null, "Premium Velvet Jewelry Box", 1299m, null, 40, null }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 12);

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 22, 12, 55, 41, 175, DateTimeKind.Utc).AddTicks(9273));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 22, 12, 55, 41, 176, DateTimeKind.Utc).AddTicks(342));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 22, 12, 55, 41, 176, DateTimeKind.Utc).AddTicks(345));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 22, 12, 55, 41, 176, DateTimeKind.Utc).AddTicks(345));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 22, 12, 55, 41, 176, DateTimeKind.Utc).AddTicks(346));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 22, 12, 55, 41, 176, DateTimeKind.Utc).AddTicks(347));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 22, 12, 55, 41, 176, DateTimeKind.Utc).AddTicks(348));

            migrationBuilder.UpdateData(
                table: "Coupons",
                keyColumn: "CouponId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 22, 12, 55, 41, 176, DateTimeKind.Utc).AddTicks(5201));

            migrationBuilder.UpdateData(
                table: "Coupons",
                keyColumn: "CouponId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 22, 12, 55, 41, 176, DateTimeKind.Utc).AddTicks(7644));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 1,
                column: "Description",
                value: "Premium gold-plated bangles.");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 2,
                column: "Description",
                value: "Minimalist invisible chain.");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 3,
                column: "Description",
                value: "Trending Korean style earrings.");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "ProductId",
                keyValue: 4,
                column: "Description",
                value: "Thick dollar chain.");
        }
    }
}
