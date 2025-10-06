import data from "@/data/data.json";
import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
  const updatedData = await request.json();
  const allowedProps = ["title", "description"];
  const articleId = params.id;

  const invalidProps = Object.keys(updatedData).filter(
    key => !allowedProps.includes(key)
  );

  if (invalidProps.length > 0) {
    return NextResponse.json(
      {
        error:
          "Invalid properties only title and description allowed for update"
      },
      { status: 404 }
    );
  }

  const articleIndex = data.findIndex(
    article => parseInt(article.article_id) === parseInt(articleId)
  );

  if (articleIndex === -1) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  if (updatedData.title) {
    data[articleIndex].title = updatedData.title;
  }
  if (updatedData.description) {
    data[articleIndex].description = updatedData.description;
  }

  return NextResponse.json(data[articleIndex]);
}

export async function DELETE(request, { params }) {
  const articleId = params.id;
  const articleIndex = data.findIndex(
    article => parseInt(article.article_id) === parseInt(articleId)
  );

  if (articleIndex === -1) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }

  const articleToDelete = data[articleIndex];
  data.splice(articleIndex, 1);

  return Response.json(articleToDelete);
}
