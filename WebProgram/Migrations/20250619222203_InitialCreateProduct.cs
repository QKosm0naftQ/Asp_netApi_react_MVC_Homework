using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebProgram.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreateProduct : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "tblProducts",
                type: "character varying(40000)",
                maxLength: 40000,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(4000)",
                oldMaxLength: 4000);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "tblProducts",
                type: "character varying(4000)",
                maxLength: 4000,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(40000)",
                oldMaxLength: 40000);
        }
    }
}
