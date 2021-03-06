from unittest import TestCase

from app import app, games

# Make Flask errors be real errors, not HTML pages with error info
app.config['TESTING'] = True

# This is a bit of hack, but don't use Flask DebugToolbar
app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']


class BoggleAppTestCase(TestCase):
    """Test flask app of Boggle."""

    def setUp(self):
        """Stuff to do before every test."""

        self.client = app.test_client()
        app.config['TESTING'] = True

    def test_homepage(self):
        """Make sure information is in the session and HTML is displayed"""

        with self.client as client:
            response = client.get('/')
            ...
            # test that you're getting a template
            html = response.get_data(as_text = True)
            self.assertEqual(response.status_code, 200)
            self.assertIn("<table class=\"board\"", html)

    def test_api_new_game(self):
        """Test starting a new game."""

        with self.client as client:
            ...
            # write a test for this route
            response = client.get('/api/new-game')
            JSON = response.json

            self.assertEqual(response.status_code, 200)
            self.assertEqual(type(JSON['board']), list)
            self.assertEqual(type(JSON['gameId']), str)
            self.assertIn(JSON['gameId'], games)

    def test_new_game_to_word_check(self):
        """Integrated test from generating new game and checking words on game instance"""

        with self.client as client:
            response = client.get('/api/new-game')
            new_game_id = response.json["gameId"]
            
            self.assertEqual(response.status_code, 200)

            game = games[new_game_id]
            game.board = [["H","X","A","A","C"],
                         ["R","R","P","W","N"],
                         ["T","O","M","E","S"],
                         ["S","E","X","M","U"],
                         ["N","O","N","O","W"]]
            
            score_word_1 = client.post('/api/score-word', json = {"gameId": new_game_id, "word": "TOMES"})
            self.assertEqual(score_word_1.json, {"result": "ok"})

            score_word_2 = client.post('/api/score-word', json = {"gameId": new_game_id, "word": "DFLASDF"})
            self.assertEqual(score_word_2.json, {"result": "not-word"})

            score_word_3 = client.post('/api/score-word', json = {"gameId": new_game_id, "word": "ABVOLTS"})
            self.assertEqual(score_word_3.json, {"result": "not-on-board"})