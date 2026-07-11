import { afterEach, describe, expect, it } from "bun:test";
import { readFileSync } from "node:fs";
import { Field, FieldDescription, FieldError, FieldLabel, Input, componentManifest } from "../../src";
import "../dom-setup";

const { cleanup, render, screen } = await import("@testing-library/react");

afterEach(cleanup);

describe("Field accessibility linkage", () => {
  it("ships the compound field through the experimental manifest lane", () => {
    const packageJson = JSON.parse(
      readFileSync(new URL("../../package.json", import.meta.url), "utf8")
    );

    expect(componentManifest).toContainEqual(
      expect.objectContaining({
        name: "Field",
        exportPath: "@keelim/all-web-ui/field",
        lifecycle: "experimental"
      })
    );
    expect(packageJson.exports["./field"]).toEqual({
      types: "./dist/components/field.d.ts",
      import: "./dist/components/field.js",
      default: "./dist/components/field.js"
    });
  });

  it("links the generated label and description to Input", () => {
    render(
      <Field>
        <FieldLabel>Email</FieldLabel>
        <Input />
        <FieldDescription>Used for account notices.</FieldDescription>
      </Field>
    );

    const input = screen.getByRole("textbox", { name: "Email" });
    const description = screen.getByText("Used for account notices.");

    expect(input.id).toBeTruthy();
    expect(screen.getByText("Email").getAttribute("for")).toBe(input.id);
    expect(input.getAttribute("aria-describedby")).toBe(description.id);
    expect(input.getAttribute("aria-invalid")).toBeNull();
  });

  it("does not reference description or error elements that are not rendered", () => {
    render(
      <Field>
        <FieldLabel>Name</FieldLabel>
        <Input />
      </Field>
    );

    const input = screen.getByRole("textbox", { name: "Name" });
    expect(input.getAttribute("aria-describedby")).toBeNull();
    expect(input.getAttribute("aria-errormessage")).toBeNull();
  });

  it("links invalid inputs to description, error, and existing help", () => {
    render(
      <>
        <p id="external-help">External help</p>
        <Field controlId="email-address" invalid>
          <FieldLabel>Email</FieldLabel>
          <Input aria-describedby="external-help" />
          <FieldDescription>Use a work address.</FieldDescription>
          <FieldError>Enter a valid email.</FieldError>
        </Field>
      </>
    );

    const input = screen.getByRole("textbox", { name: "Email" });
    const description = screen.getByText("Use a work address.");
    const error = screen.getByRole("alert");

    expect(input.id).toBe("email-address");
    expect(input.getAttribute("aria-describedby")?.split(" ")).toEqual([
      "external-help",
      description.id,
      error.id
    ]);
    expect(input.getAttribute("aria-errormessage")).toBe(error.id);
    expect(input.getAttribute("aria-invalid")).toBe("true");
  });

  it("gives multiple descriptions and errors unique linked IDs", () => {
    render(
      <Field invalid>
        <FieldLabel>Account</FieldLabel>
        <Input />
        <FieldDescription>Primary guidance.</FieldDescription>
        <FieldDescription>Secondary guidance.</FieldDescription>
        <FieldError>First problem.</FieldError>
        <FieldError>Second problem.</FieldError>
      </Field>
    );

    const input = screen.getByRole("textbox", { name: "Account" });
    const descriptionIds = [
      screen.getByText("Primary guidance.").id,
      screen.getByText("Secondary guidance.").id
    ];
    const errorIds = screen.getAllByRole("alert").map((error) => error.id);
    const linkedIds = input.getAttribute("aria-describedby")?.split(" ") ?? [];

    expect(new Set([...descriptionIds, ...errorIds]).size).toBe(4);
    expect(linkedIds).toEqual([...descriptionIds, ...errorIds]);
    expect(input.getAttribute("aria-errormessage")?.split(" ")).toEqual(errorIds);
  });
});
