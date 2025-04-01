from django.shortcuts import render

def game_view(request):
    return render(request, 'game.html')  # Ensure 'game.html' exists in the templates directory
