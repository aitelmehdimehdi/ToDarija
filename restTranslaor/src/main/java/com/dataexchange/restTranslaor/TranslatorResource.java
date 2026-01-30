package com.dataexchange.restTranslaor;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.FormParam;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Root resource (exposed at "myresource" path)
 */
@Path("translator")
public class TranslatorResource {
	private static final String OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
    private static final String MODEL = "tngtech/deepseek-r1t2-chimera:free";
    private static final String api_key = "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";

    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String getIt() {
        return "Hello, Heroku!";
    }

    @POST()
    @Path("/ask")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)
    public Response translate(@FormParam("text") String text) {
        if (text == null || text.isBlank()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\":\"Missing 'text' parameter\"}")
                    .build();
        }
        try {
            String jsonBody = "{"
            	    + "\"model\": \"" + MODEL + "\","
            	    + "\"messages\": ["
            	    + "{ \"role\": \"user\", \"content\": \"Translate the following text into Moroccan Darija using only Arabic script. Only return the translation. Do NOT include Latin transcription, explanations, notes, or extra text: '"
            	    + escapeJson(text) + "'\" }"
            	    + "]"
            	    + "}";

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(OPENROUTER_URL))
                    .header("Authorization", "Bearer " + api_key)
                    .header("HTTP-Referer", "http://localhost")
                    .header("X-Title", "JAX-RS OpenRouter App")
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            HttpClient client = HttpClient.newHttpClient();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            // Parse JSON and extract only the translated text
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.body());
            JsonNode contentNode = root.path("choices").get(0).path("message").path("content");
            String translation = contentNode.asText().trim();

            // Return just the translation
            return Response.ok("{\"translation\":\"" + escapeJson(translation) + "\"}", MediaType.APPLICATION_JSON)
                    .build();
            } 
        catch (Exception e) {
	            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
	                    .entity("{\"error\":\"" + e.getMessage().replace("\"", "'") + "\"}")
	                    .build();
	      }
    }
    
    private String escapeJson(String s) {
        return s.replace("\"", "\\\"");
    }
}
