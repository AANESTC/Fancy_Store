using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace FancyStore.API.Migrations
{
    /// <inheritdoc />
    public partial class AddPriceRanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PriceRanges",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Label = table.Column<string>(type: "text", nullable: false),
                    MinPrice = table.Column<decimal>(type: "numeric", nullable: true),
                    MaxPrice = table.Column<decimal>(type: "numeric", nullable: true),
                    SortOrder = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PriceRanges", x => x.Id);
                });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 23, 6, 26, 39, 376, DateTimeKind.Utc).AddTicks(1457));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 23, 6, 26, 39, 376, DateTimeKind.Utc).AddTicks(3094));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 23, 6, 26, 39, 376, DateTimeKind.Utc).AddTicks(3098));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 23, 6, 26, 39, 376, DateTimeKind.Utc).AddTicks(3099));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 23, 6, 26, 39, 376, DateTimeKind.Utc).AddTicks(3101));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 23, 6, 26, 39, 376, DateTimeKind.Utc).AddTicks(3102));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 23, 6, 26, 39, 376, DateTimeKind.Utc).AddTicks(3103));

            migrationBuilder.UpdateData(
                table: "Coupons",
                keyColumn: "CouponId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 23, 6, 26, 39, 843, DateTimeKind.Utc).AddTicks(1261));

            migrationBuilder.UpdateData(
                table: "Coupons",
                keyColumn: "CouponId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 23, 6, 26, 39, 843, DateTimeKind.Utc).AddTicks(5306));

            migrationBuilder.InsertData(
                table: "PriceRanges",
                columns: new[] { "Id", "Label", "MaxPrice", "MinPrice", "SortOrder" },
                values: new object[,]
                {
                    { 1, "Under ₹500", 499m, 0m, 1 },
                    { 2, "₹500 - ₹1000", 1000m, 500m, 2 },
                    { 3, "₹1000 - ₹2000", 2000m, 1000m, 3 },
                    { 4, "Over ₹2000", null, 2001m, 4 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PriceRanges");

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
        }
    }
}
