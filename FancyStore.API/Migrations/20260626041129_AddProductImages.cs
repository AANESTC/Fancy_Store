using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace FancyStore.API.Migrations
{
    /// <inheritdoc />
    public partial class AddProductImages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ProductImages",
                columns: table => new
                {
                    ProductImageId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ProductId = table.Column<int>(type: "integer", nullable: false),
                    ImageUrl = table.Column<string>(type: "text", nullable: false),
                    DisplayOrder = table.Column<int>(type: "integer", nullable: false),
                    RotationAngle = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductImages", x => x.ProductImageId);
                    table.ForeignKey(
                        name: "FK_ProductImages_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "ProductId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 26, 4, 11, 24, 140, DateTimeKind.Utc).AddTicks(2216));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 26, 4, 11, 24, 140, DateTimeKind.Utc).AddTicks(4335));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 26, 4, 11, 24, 140, DateTimeKind.Utc).AddTicks(4339));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 26, 4, 11, 24, 140, DateTimeKind.Utc).AddTicks(4341));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 26, 4, 11, 24, 140, DateTimeKind.Utc).AddTicks(4342));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 26, 4, 11, 24, 140, DateTimeKind.Utc).AddTicks(4343));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "CategoryId",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 26, 4, 11, 24, 140, DateTimeKind.Utc).AddTicks(4344));

            migrationBuilder.UpdateData(
                table: "Coupons",
                keyColumn: "CouponId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 26, 4, 11, 24, 501, DateTimeKind.Utc).AddTicks(3037));

            migrationBuilder.UpdateData(
                table: "Coupons",
                keyColumn: "CouponId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 6, 26, 4, 11, 24, 501, DateTimeKind.Utc).AddTicks(6876));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 1,
                column: "PasswordHash",
                value: "$2a$11$5b5c4jfX/H4X9GKtU2MRZuvXexnMdvhkrAlk5o7R7coIn7JIJEEyu");

            migrationBuilder.CreateIndex(
                name: "IX_ProductImages_ProductId",
                table: "ProductImages",
                column: "ProductId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProductImages");

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

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "UserId",
                keyValue: 1,
                column: "PasswordHash",
                value: "$2a$11$32.YDLemy2B2Qcwor8b.Mu2Q6mqAyEU9QZnB0wYhUj1JVZfquPt2a");
        }
    }
}
